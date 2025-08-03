import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { AWS_REGION } from "../env.js";
import { BUCKET_NAME } from "../env.js";
import { writeFile } from "../utils/utils.js";

// Initialize S3 client

const s3 = new S3Client({ region: AWS_REGION as string });
/**
 * Fetches the contents of a folder in an S3 bucket.
 * @param prefix - The folder path (prefix) in the S3 bucket.
 * @param localPath - The local path where the files will be saved.
 * @returns An array of objects representing the contents of the folder.
 */
async function fetchS3FolderContents(prefix: string, localPath: string) {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3.send(listCommand);
    if (response.Contents) {
      await Promise.all(
        response.Contents.map(async (object) => {
          if (!object.Key) return;
          const fileKey = object.Key;
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
          });

          const data = await s3.send(getCommand);
          if (data.Body) {
            // Convert stream to Buffer
            const stream = data.Body as NodeJS.ReadableStream;
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const fileData = Buffer.concat(chunks);
            const filePath = `${localPath}/${fileKey.replace(prefix, "")}`;

            await writeFile(filePath, fileData);

            console.log(`Downloaded ${fileKey} to ${filePath}`);
          }
        })
      );
    }
  } catch (error) {
    console.error("❌ Error fetching folder contents:", error);
    return [];
  }
}

export { fetchS3FolderContents };
