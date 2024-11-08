import { PrivateDocument } from "#models/document";
import { PrivateDocumentUpload } from "#models/document_upload";
import env from "#start/env";
import { inject } from "@adonisjs/core";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@inject()
export class R2 {
  readonly client: S3Client;
  readonly bucket: string;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${env.get("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.get("R2_ACCESS_KEY_ID"),
        secretAccessKey: env.get("R2_SECRET_ACCESS_KEY"),
      },
    });

    this.bucket = env.get("R2_BUCKET");
  }

  async getSignedUploadUrl(relativePath: string): Promise<string> {
    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${env.get("R2_DOCUMENT_UPLOADS_DIRECTORY")}/${relativePath}`,
      }),
      {
        expiresIn: 600, // 10 minutes
      }
    );

    return url;
  }

  async moveUploadToDocuments(
    upload: PrivateDocumentUpload,
    document: PrivateDocument
  ): Promise<void> {
    await this.client.send(
      new CopyObjectCommand({
        CopySource: `${this.bucket}/${upload.path}`,
        Bucket: this.bucket,
        Key: document.path,
      })
    );

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: upload.path,
      })
    );
  }

  async deleteDocument(document: PrivateDocument): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: document.path,
      })
    );
  }
}
