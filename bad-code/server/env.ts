import dotenv from 'dotenv'
dotenv.config()
console.log('BUCKET_NAME:', process.env.BUCKET_NAME);

export const { BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
