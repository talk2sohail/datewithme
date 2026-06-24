import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent as HttpsAgent } from "https";
import crypto from "crypto";
import { logError, logInfo } from "./logger";

const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretKey = process.env.S3_SECRET_KEY;
const s3Bucket = process.env.S3_BUCKET;

function getClient() {
  if (!s3Endpoint || !s3AccessKey || !s3SecretKey || !s3Bucket) {
    throw new Error("S3 storage not configured");
  }
  return {
    client: new S3Client({
      endpoint: s3Endpoint,
      region: "us-east-1",
      credentials: { accessKeyId: s3AccessKey, secretAccessKey: s3SecretKey },
      forcePathStyle: true,
      requestHandler: new NodeHttpHandler({
        httpsAgent: new HttpsAgent({ rejectUnauthorized: false }),
      }),
    }),
    bucket: s3Bucket,
  };
}

export async function uploadPhoto(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<string> {
  const ext = mimeType.split("/")[1] || "jpg";
  const key = `photos/${crypto.randomUUID()}.${ext}`;

  try {
    const { client, bucket } = getClient();

    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: "public, max-age=31536000, immutable",
      },
    });

    await upload.done();

    const url = `${s3Endpoint}/${bucket}/${key}`;
    logInfo("photo.upload", `uploaded to SeaweedFS: ${key}`, { key, url });
    return url;
  } catch (err) {
    logError("photo.upload", `SeaweedFS upload failed, falling back to base64`, {
      key, error: String(err), stack: err instanceof Error ? err.stack : undefined,
    });

    const base64 = fileBuffer.toString("base64");
    return `data:${mimeType};base64,${base64}`;
  }
}
