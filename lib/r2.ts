import { S3Client } from "@aws-sdk/client-s3";

export function getR2Client() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;



    if (!accountId) {
        throw new Error("Missing R2_ACCOUNT_ID = " + accountId);
    }

    if (!accessKeyId) {
        throw new Error("Missing R2_ACCESS_KEY_ID = " + accessKeyId);
    }

    if (!secretAccessKey) {
        throw new Error("Missing R2_SECRET_ACCESS_KEY = " + secretAccessKey);
    }


    const r2 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    return r2;
}
