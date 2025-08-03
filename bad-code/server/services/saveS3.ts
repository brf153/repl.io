import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { AWS_REGION } from "../env.js";
import { BUCKET_NAME } from "../env.js";

// Initialize S3 client
const s3 = new S3Client({ region: AWS_REGION as string });

/**
 * Fetches the contents of a folder in an S3 bucket.
 * @param key - The S3 key (folder path) where the file will be saved.
 * @param filePath - The path of the file to be saved in S3.
 * @param content - The content to be saved in the file.
 * @returns {Promise<void>} - A promise that resolves when the file is saved to S3.
 * @throws {Error} - Throws an error if the S3 operation fails.
 */

export const saveToS3 = async (key: string, filePath: string, content: string): Promise<void> => {
    const params = {
        Bucket: BUCKET_NAME ?? "",
        Key: `${key}${filePath}`,
        Body: content
    };
    try {
        await s3.send(new PutObjectCommand(params));
    } catch (error) {
        console.error("Error saving to S3:", error);
        throw new Error(`Failed to save file to S3: ${(error as Error).message}`);
    }
}