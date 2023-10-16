import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function initS3Client() {
  const localStackHostName = process.env["LOCALSTACK_HOSTNAME"];
  const edgePort = process.env["EDGE_PORT"];
  const endpoint = `https://${localStackHostName}:${edgePort}`;
  return new S3Client({
    endpoint,
    forcePathStyle: true,
  });
}
//
type TestFunctionEvent = {
  file: string;
  key: string;
};

export async function handler(event: TestFunctionEvent) {
  const bucketName = process.env["BUCKET_NAME"];
  const s3Client = initS3Client();
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: event.key,
    Body: event.file,
  });
  await s3Client.send(putObjectCommand);
}
