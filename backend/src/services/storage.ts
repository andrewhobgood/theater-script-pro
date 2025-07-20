import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export async function uploadToS3(
  file: Express.Multer.File,
  bucket: string,
  folder: string,
  filename?: string
): Promise<UploadResult> {
  try {
    const fileExtension = file.originalname.split('.').pop();
    const key = `${folder}/${filename || crypto.randomUUID()}.${fileExtension}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    };

    const result = await s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
    };
  } catch (error) {
    logger.error('Error uploading to S3:', error);
    throw error;
  }
}

export async function deleteFromS3(bucket: string, key: string): Promise<void> {
  try {
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
  } catch (error) {
    logger.error('Error deleting from S3:', error);
    throw error;
  }
}

export async function generatePresignedUrl(
  bucket: string,
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn,
    });

    return url;
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    throw error;
  }
}

export async function copyS3Object(
  sourceBucket: string,
  sourceKey: string,
  destinationBucket: string,
  destinationKey: string
): Promise<void> {
  try {
    await s3.copyObject({
      CopySource: `${sourceBucket}/${sourceKey}`,
      Bucket: destinationBucket,
      Key: destinationKey,
    }).promise();
  } catch (error) {
    logger.error('Error copying S3 object:', error);
    throw error;
  }
}

// Helper function to extract first few pages for perusal script
export async function createPerusalScript(
  originalFile: Express.Multer.File,
  maxPages: number = 10
): Promise<Buffer> {
  // TODO: Implement PDF page extraction
  // For now, return the original file
  // In production, use pdf-lib or similar to extract pages
  return originalFile.buffer;
}

// Download file from S3
export async function downloadFile(url: string): Promise<Buffer> {
  try {
    // Extract bucket and key from S3 URL
    const urlParts = url.match(/https?:\/\/([^.]+)\.s3[^\/]*\.amazonaws\.com\/(.+)$/);
    if (!urlParts) {
      throw new Error('Invalid S3 URL format');
    }

    const bucket = urlParts[1];
    const key = decodeURIComponent(urlParts[2]);

    const params = {
      Bucket: bucket,
      Key: key,
    };

    const data = await s3.getObject(params).promise();
    return data.Body as Buffer;
  } catch (error) {
    logger.error('Error downloading from S3:', error);
    throw error;
  }
}

// Upload temporary file with automatic expiration
export async function uploadTemporaryFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const bucket = config.aws.tempBucket || config.aws.scriptsBucket;
    const key = `temp/${crypto.randomUUID()}/${filename}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        expiresIn: String(expiresIn),
      },
      // Set object to expire after the specified time
      Expires: new Date(Date.now() + expiresIn * 1000),
    };

    await s3.putObject(params).promise();

    // Generate presigned URL
    return generatePresignedUrl(bucket, key, expiresIn);
  } catch (error) {
    logger.error('Error uploading temporary file:', error);
    throw error;
  }
}

// Export storage service object for convenience
export const storageService = {
  uploadToS3,
  deleteFromS3,
  generatePresignedUrl,
  copyS3Object,
  createPerusalScript,
  downloadFile,
  uploadTemporaryFile,
};