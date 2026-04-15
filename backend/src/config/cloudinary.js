const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('[Cloudinary] cloud_name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');
console.log('[Cloudinary] api_key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
console.log('[Cloudinary] api_secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

const uploadToCloudinary = (buffer) => {
  console.log('[Cloudinary] Starting upload, buffer size:', buffer?.length);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'student-management', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error.message);
          reject(error);
        } else {
          console.log('[Cloudinary] Upload success:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
