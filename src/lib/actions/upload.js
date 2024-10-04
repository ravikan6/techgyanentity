'use server';

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export async function uploadImage(file, folder) {
  if (!file) {
    return { success: false, message: 'No file uploaded' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'TechGyan',
          use_filename: true,
          unique_filename: true,
          overwrite: true,
          filename_override: file.name,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  };

  try {
    const result = await streamUpload(buffer);
    console.log('File uploaded successfully:', result);
    return { success: true, message: 'File uploaded successfully', data: result };
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error);
    return { success: false, message: 'Upload to Cloudinary failed', error: error.message };
  }
}


export async function deleteCloudinaryImage(public_id) {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('File deleted successfully:', result);
    return { success: true, message: 'File deleted successfully', data: result };
  } catch (error) {
    console.error('Delete from Cloudinary failed:', error);
    return { success: false, message: 'Delete from Cloudinary failed', error: error.message };
  }
}