// app/server-actions/uploadImage.js
'use server';

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export async function uploadImage(request) {
  const formData = await request.formData;
  const file = formData.get('file');

  if (!file) {
    return { status: 400, message: 'No file uploaded' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'TechGyan',
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
    return { status: 200, message: 'File uploaded successfully', url: result.secure_url };
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error);
    return { status: 500, message: 'Upload to Cloudinary failed', error: error.message };
  }
}
