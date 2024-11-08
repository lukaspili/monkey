import { createUserAvatarUpload } from "@/actions/session/avatar";
import { ApiResponse } from "@/lib/api";
import { SessionUser } from "@/models/user";
import { UserAvatarUpload } from "@/models/user-avatar-upload";
import {
  ActualFileObject,
  FilePondFile,
  FilePondInitialFile,
  LoadServerConfigFunction,
  ProcessServerConfigFunction,
  ProgressServerConfigFunction,
} from "filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

// Import FilePond styles
// 1.
import "filepond/dist/filepond.min.css";
// 2.
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";

registerPlugin(
  FilePondPluginFilePoster,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

type FilePondServer = {
  process: ProcessServerConfigFunction;
  load: LoadServerConfigFunction;
  revert: any;
  restore: any;
  fetch: any;
};
const server: FilePondServer = {
  // See: https://pqina.nl/filepond/docs/api/server/#process-1
  process: async (
    /** The name of the input field. */
    _fieldName: string,
    /** The actual file object to send. */
    file: ActualFileObject,
    _metadata: { [key: string]: any },
    /**
     * Should call the load method when done and pass the returned server file id.
     * This server file id is then used later on when reverting or restoring a file
     * so that your server knows which file to return without exposing that info
     * to the client.
     */
    load: (p: string | { [key: string]: any }) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void
  ) => {
    let response!: ApiResponse<UserAvatarUpload>;

    try {
      response = await createUserAvatarUpload({
        name: file.name,
        mimeType: file.type,
        size: file.size,
      });
    } catch (e) {
      error("Upload failed. Please try again.");
      return;
    }

    if (response.failed) {
      error(response.simpleError);
      return;
    }

    const upload = response.data!;
    console.log("Upload:", upload);

    const request = new XMLHttpRequest();
    request.open("PUT", upload.signedUrl);

    // Should call the progress method to update the progress to 100% before calling load
    // Setting computable to false switches the loading indicator to infinite mode
    request.upload.onprogress = (e) => {
      progress(e.lengthComputable, e.loaded, e.total);
    };

    // Should call the load method when done and pass the returned server file id
    // this server file id is then used later on when reverting or restoring a file
    // so your server knows which file to return without exposing that info to the client
    request.onload = function () {
      console.log("REQUEST STATUS:", request.status);
      if (request.status >= 200 && request.status < 300) {
        // the load method accepts either a string (id) or an object
        load(upload.id);
      } else {
        // Can call the error method if something is wrong, should exit after
        error("Upload failed. Please try again.");
      }
    };

    request.onerror = function () {
      error("Upload failed. Please try again.");
    };

    request.send(file);

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // This function is entered if the user has tapped the cancel button
        request.abort();

        // Let FilePond know the request has been cancelled
        abort();
      },
    };
  },

  load: async (
    source: any,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject | Blob) => void
  ) => {
    console.log("Load:", source);
    const file = await fetch(source).then((res) => res.blob());
    load(file);
  },

  revert: null,
  restore: null,
  fetch: null,
};

export type AvatarInputController = {
  revert: () => void;
  toggleDisabled: (disabled: boolean) => void;
};

export const AvatarInput = forwardRef(function AvatarInputInternal<T extends FieldValues>(
  {
    name,
    user,
  }: {
    name: FieldPath<T>;
    user: SessionUser;
  },
  ref: React.ForwardedRef<AvatarInputController>
) {
  useImperativeHandle(ref, () => ({
    revert,
    toggleDisabled,
  }));

  const revert = () => {
    if (user.avatar) {
      setNewFiles([
        {
          source: user.avatar!.url,
          options: {
            type: "local",
          },
        },
      ]);
    } else {
      setNewFiles([]);
    }
  };

  const toggleDisabled = (disabled: boolean) => {
    setDisabled(disabled);
  };

  const [files, setNewFiles] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);
  const [disabled, setDisabled] = useState(false);

  const filePondRef = useRef<FilePond | null>(null);
  const form = useFormContext<T>();

  useEffect(() => {
    if (user.avatar) {
      setNewFiles([
        {
          source: user.avatar!.url,
          options: {
            type: "local",
          },
        },
      ]);
    } else {
      setNewFiles([]);
    }
  }, [user]);

  return (
    <div className="size-24">
      <input type="hidden" {...form.register(name)} />
      <FilePond
        ref={filePondRef}
        name="avatar"
        server={server}
        files={files}
        disabled={disabled}
        allowMultiple={false}
        // @ts-ignore
        // This prop is not in the types, but it's a bug. See: https://github.com/pqina/filepond/pull/979/files
        allowRemove={false}
        allowReplace={true}
        allowRevert={false}
        iconDone=""
        stylePanelLayout="compact circle"
        styleLoadIndicatorPosition="center bottom"
        styleProgressIndicatorPosition="center bottom"
        styleButtonRemoveItemPosition="center bottom"
        styleButtonProcessItemPosition="center bottom"
        imageCropAspectRatio="1:1"
        imageResizeTargetWidth={400}
        labelIdle='<span class="filepond--label-xs">Drag or <span class="filepond--label-action">Browse</span></span>'
        // oninit={() => setFilePond(filePond.current)}
        onupdatefiles={(files: FilePondFile[]) => {
          console.log("SET FILES = ", files);
          setNewFiles(files.map((file) => file.file as File));
        }}
        onactivatefile={() => {
          filePondRef.current?.browse();
        }}
        onprocessfile={(_error, file) => {
          form.setValue(name, file.serverId as any);
        }}
        onprocessfileabort={() => {
          form.resetField(name);
        }}
        onprocessfilerevert={() => {
          form.resetField(name);
        }}
        onprocessfilestart={() => {
          form.resetField(name);
        }}
        onremovefile={() => {
          form.resetField(name);
        }}
        onerror={() => {
          form.setError(name, { message: "Upload failed. Please try again." });
        }}
      />
    </div>
  );
});
