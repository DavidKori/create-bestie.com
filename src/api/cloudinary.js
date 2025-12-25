// utils/cloudinaryConfig.js
export const cloudinaryConfig = {
  cloudName: 'your-cloud-name', // You'll get this from Cloudinary dashboard
  uploadPreset: 'bestiespace_upload', // Create this in Cloudinary settings
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY, // From Cloudinary
  apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET, // From Cloudinary
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;