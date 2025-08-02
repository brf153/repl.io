import type express from 'express';
import { copyS3Folder } from '../services/copyFolder.js';
import { BUCKET_NAME } from '../env.js';


const setupCode = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { tech, replName } = req.body;
    console.log("checking bucket name", BUCKET_NAME);
    if (!tech || !replName || !BUCKET_NAME) {
        return res.status(400).json({ error: 'Technology, Repl Name, and Bucket Name are required', data: { tech, replName, bucketName: BUCKET_NAME } });
    }

    try {
        // Logic to copy S3 folder based on tech and replName
        console.log(`Copying S3 folder for ${tech} with Repl Name: ${replName}`);
        await copyS3Folder(BUCKET_NAME, `base/${tech}`, `code/${replName}`);

        // Respond to the client
        console.log('Copy initiated successfully');
        res.status(200).json({ message: 'Copy initiated' });
    } catch (error) {
        console.error('Error copying S3 folder:', error);
        res.status(500).json({ error: 'Failed to copy S3 folder', details: (error as Error).message });
    }
};

export { setupCode };