import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { AWS_REGION } from "../env.js";
import { BUCKET_NAME } from "../env.js";
import { writeFile } from "../utils/utils.js";
import fs from "fs";
import * as path from "path";

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
    console.log(`📁 Ensuring local folder exists at: ${localPath}`);
    await fs.promises.mkdir(localPath, { recursive: true });

    console.log(`📡 Listing objects with prefix: "${prefix}" from bucket: "${BUCKET_NAME}"`);
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      console.warn("⚠️ No objects found in the specified prefix.");
      return;
    }

    console.log(`🔍 Found ${response.Contents.length} objects.`);

    await Promise.all(
      response.Contents.map(async (object) => {
        if (!object.Key) return;

        const fileKey = object.Key;
        console.log(`⬇️ Downloading: ${fileKey}`);

        try {
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
          });

          const data = await s3.send(getCommand);
          const stream = data.Body as NodeJS.ReadableStream;

          const chunks: Buffer[] = [];
          for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const fileData = Buffer.concat(chunks);
          const relativePath = fileKey.replace(prefix, "");
          const filePath = path.join(localPath, relativePath);

          console.log(`💾 Writing to local path: ${filePath}`);
          await writeFile(filePath, fileData);
        } catch (err) {
          console.error(`❌ Failed to download or write ${fileKey}:`, err);
        }
      })
    );

    console.log("✅ Finished downloading all files.");
  } catch (error) {
    console.error("❌ Error fetching folder contents:", error);
  }
}

export { fetchS3FolderContents };
