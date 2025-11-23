import { S3Client } from "@aws-sdk/client-s3";

//getSecret('AWS_KEY_ID')

const accessKeyId = import.meta.env.R2_ACCESS_KEY_ID
const r2BucketName = import.meta.env.R2_BUCKET_NAME
const secretAccessKey = import.meta.env.R2_SECRET_ACCESS_KEY
const r2AccountId = import.meta.env.R2_ACCOUNT_ID

export const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})