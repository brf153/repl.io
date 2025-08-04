import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
import { AWS_REGION } from '../env.js';

// Initialize S3 client

const s3 = new S3Client({ region: AWS_REGION as string });

/**
 * Copies all objects from one S3 folder to another within the same bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} sourcePrefix - The source folder prefix (e.g., 'source-folder/').
 * @param {string} destinationPrefix - The destination folder prefix (e.g., 'destination-folder/').
 */
async function copyS3Folder(
  bucketName: string,
  sourcePrefix: string,
  destinationPrefix: string
) {
  try {
    console.log(`📦 Starting copy from: "${sourcePrefix}" → "${destinationPrefix}" in bucket "${bucketName}"`);

    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: sourcePrefix,
    });

    const listResponse = await s3.send(listCommand);
    const objects = listResponse.Contents || [];

    if (objects.length === 0) {
      console.warn(`⚠️ No objects found with prefix: "${sourcePrefix}"`);
      return;
    }

    console.log(`🔍 Found ${objects.length} objects to copy.`);

    for (const object of objects) {
      if (!object.Key) {
        console.warn("⚠️ Skipping object with empty key.");
        continue;
      }

      const relativeKey = object.Key.substring(sourcePrefix.length);
      const destKey = `${destinationPrefix}${relativeKey}`;
      const copySource = `${bucketName}/${object.Key}`;

      console.log(`📤 Copying: ${object.Key}`);
      console.log(`    ↳ To: ${destKey}`);

      try {
        const copyCommand = new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: copySource,
          Key: destKey,
        });

        await s3.send(copyCommand);
        console.log(`✅ Successfully copied to ${destKey}`);
      } catch (err) {
        console.error(`❌ Failed to copy ${object.Key} → ${destKey}:`, err);
      }
    }

    console.log("✅ Folder copy operation completed.");
  } catch (error) {
    console.error("❌ Error during folder copy:", error);
  }
}

export { copyS3Folder };
