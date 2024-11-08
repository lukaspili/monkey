import e from "#db/edgeql/index";
import { SessionUser, SessionUserShape } from "#models/user";
import { PrivateUserAvatarShape } from "#models/user_avatar";
import {
  PrivateUserAvatarUploadShape,
  SessionUserAvatarUpload,
  SessionUserAvatarUploadShape,
} from "#models/user_avatar_upload";
import { R2 } from "#services/r2";
import { assertOneResult } from "#utils/edge";
import { SessionAvatarValidator } from "#validators/session/avatar_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";
import { nanoid } from "nanoid";
import * as path from "node:path";

@inject()
export class UserAvatarUploadTask {
  constructor(private r2: R2) {}

  async createUpload(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionAvatarValidator.upload>
  ): Promise<SessionUserAvatarUpload> {
    const { name, mimeType, size } = payload;

    const extension = path.extname(name);
    const basename = path.basename(name, extension);
    const file = `${basename}-${nanoid()}${extension}`;
    const directory = "user-avatars";
    const relativePath = `${directory}/${file}`;

    const signedUrl = await this.r2.getSignedUploadUrl(relativePath);

    const upload = await assertOneResult(
      Query.insertUpload.run(client, {
        userId: userId,
        name,
        file,
        directory,
        mimeType,
        size,
        signedUrl,
      })
    );

    return upload;
  }

  async confirmUpload(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionAvatarValidator.update>
  ): Promise<SessionUser> {
    const { uploadId } = payload;

    const upload = await assertOneResult(
      Query.selectPrivateUpload.run(client, {
        userId,
        uploadId,
      })
    );

    // Initialize the document creation and copy:
    // 1. Mark the upload as in progress;
    // 2. Create a document in progress with the same properties as the upload.
    //
    // The document is not yet current, as we wait for the file to be copied to R2 first.
    // Duplicate inserts are prevented by exclusive constraint on `relative_path`.
    const document = await assertOneResult(
      Query.initializeAvatarCopy.run(client, {
        userId,
        uploadId,
        upload: {
          name: upload.name,
          file: upload.file,
          directory: upload.directory,
          mimeType: upload.mime_type,
          size: upload.size,
        },
      })
    );

    try {
      await this.r2.moveUploadToDocuments(upload, document);
    } catch (error) {
      // If the file could not be moved, mark the newly created document for deletion,
      // as it probably does not represent a valid file.
      await assertOneResult(Query.markFailedDocumentForDeletion.run(client, { id: document.id }));

      // And let the error propagate into an `UnknownException`.
      throw error;
    }

    let user!: SessionUser;

    try {
      user = await client.transaction(async (tx) => {
        // Set previous avatar as not current, if any.
        // Unfortunately, we can't include this request in the group below because of the exclusive constraint on `is_current`
        // that is not deferred. Somehow that breaks the unique requests group.
        // We solve it by moving this particular request outside of the group and running it first.
        await Query.unsetPreviousCurrentAvatar.run(tx, { userId });

        // Finlize the upload and document after successful copy:
        // 1. Set the document as current, and not in progress anymore;
        // 2. Mark the upload for deletion, and not in progress anymore;
        // 3. Fetch the session user with the new avatar.
        return await assertOneResult(
          Query.finalizeUploadAndDocument.run(tx, {
            userId,
            uploadId,
            documentId: document.id,
          })
        );
      });
    } catch (error) {
      // If the finalization failed unexpectedly, mark the failed document for deletion.
      await assertOneResult(Query.markFailedDocumentForDeletion.run(client, { id: document.id }));

      // Then let the error propagate normally.
      throw error;
    }

    return user;
  }
}

const Query = {
  insertUpload: e.params(
    {
      userId: e.uuid,
      name: e.str,
      file: e.str,
      directory: e.str,
      mimeType: e.str,
      size: e.int64,
      signedUrl: e.str,
    },
    ($) => {
      const insert = e.insert(e.UserAvatarUpload, {
        name: $.name,
        file: $.file,
        directory: $.directory,
        mime_type: $.mimeType,
        size: $.size,
        signed_url: $.signedUrl,
        user: e.cast(e.User, $.userId),
      });

      return e.select(insert, (_) => ({
        ...SessionUserAvatarUploadShape(_),
      }));
    }
  ),

  selectPrivateUpload: e.params(
    {
      userId: e.uuid,
      uploadId: e.uuid,
    },
    ($) =>
      e.select(e.UserAvatarUpload, (_) => ({
        filter_single: { id: $.uploadId, user: e.cast(e.User, $.userId) },
        ...PrivateUserAvatarUploadShape(_),
      }))
  ),

  initializeAvatarCopy: e.params(
    {
      userId: e.uuid,
      uploadId: e.uuid,
      upload: e.tuple({
        name: e.str,
        file: e.str,
        directory: e.str,
        mimeType: e.str,
        size: e.int64,
      }),
    },
    ($) => {
      const markUploadInProgress = e.update(e.UserAvatarUpload, (_) => ({
        filter_single: { id: $.uploadId },
        set: { copy_in_progress: true },
      }));

      const insert = e.insert(e.UserAvatar, {
        user: e.cast(e.User, $.userId),

        // Copy properties from upload, including directory, which is relative and does not include the upload directory.
        name: $.upload.name,
        file: $.upload.file,
        directory: $.upload.directory,
        mime_type: $.upload.mimeType,
        size: $.upload.size,

        // While the copy is in progress, the avatar is not yet current.
        is_current: false,
        copy_in_progress: true,
      });

      return e.with(
        [markUploadInProgress],
        e.select(insert, (_) => ({
          ...PrivateUserAvatarShape(_),
        }))
      );
    }
  ),

  markFailedDocumentForDeletion: e.params(
    {
      id: e.uuid,
    },
    ($) =>
      e.update(e.UserAvatar, (_) => ({
        filter_single: { id: $.id },
        set: {
          marked_for_deletion: true,
          copy_in_progress: false,
        },
      }))
  ),

  unsetPreviousCurrentAvatar: e.params({ userId: e.uuid }, ($) =>
    e
      .update(e.UserAvatar, (_) => ({
        filter_single: { user: e.cast(e.User, $.userId), is_current: true },
        set: { is_current: false },
      }))
      .assert_single()
  ),

  finalizeUploadAndDocument: e.params(
    {
      userId: e.uuid,
      uploadId: e.uuid,
      documentId: e.uuid,
    },
    ($) => {
      const updateCurrentDocument = e.update(e.UserAvatar, (_) => ({
        filter_single: { id: $.documentId },
        set: { copy_in_progress: false, is_current: true },
      }));

      const markUploadForDeletion = e.update(e.UserAvatarUpload, (_) => ({
        filter_single: { id: $.uploadId },
        set: { marked_for_deletion: true, copy_in_progress: false },
      }));

      return e.with(
        [updateCurrentDocument, markUploadForDeletion],
        e.select(e.User, (_) => ({
          filter_single: { id: $.userId },
          ...SessionUserShape(_),
        }))
      );
    }
  ),
};
