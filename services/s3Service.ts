import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  buffer: Buffer,
  fileName: string,
  mimetype: string
): Promise<string> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype,
    };

    const { Key } = await s3.upload(params).promise();

    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: Key,
      Expires: 604800,
    });

    return url;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
};
