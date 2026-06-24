import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "crypto";

const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretKey = process.env.S3_SECRET_KEY;
const s3Bucket = process.env.S3_BUCKET;

function getClient() {
  if (!s3Endpoint || !s3AccessKey || !s3SecretKey || !s3Bucket) {
    throw new Error("S3 storage not configured. Set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET env vars.");
  }
  return {
    client: new S3Client({
      endpoint: s3Endpoint,
      region: "us-east-1",
      credentials: { accessKeyId: s3AccessKey, secretAccessKey: s3SecretKey },
      forcePathStyle: true,
    }),
    bucket: s3Bucket,
  };
}

export async function uploadPhoto(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<string> {
  const { client, bucket } = getClient();
  const ext = mimeType.split("/")[1] || "jpg";
  const key = `photos/${crypto.randomUUID()}.${ext}`;

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

  return `${s3Endpoint}/${bucket}/${key}`;
}

export function getPublicUrl(storedUrl: string): string {
  return storedUrl;
}
