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
async function copyS3Folder(bucketName: string, sourcePrefix: string, destinationPrefix: string) {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: sourcePrefix,
    });

    const listResponse = await s3.send(listCommand);
    const objects = listResponse.Contents || [];

    for (const object of objects) {
      if (!object.Key) continue;

      const relativeKey = object.Key.substring(sourcePrefix.length);
      const destKey = `${destinationPrefix}${relativeKey}`;

      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${object.Key}`,
        Key: destKey,
      });

      console.log(`Copying ${object.Key} → ${destKey}`);
      await s3.send(copyCommand);
    }

    console.log("✅ Folder copy complete.");
  } catch (error) {
    console.error("❌ Error copying folder:", error);
  }
}

export { copyS3Folder };
