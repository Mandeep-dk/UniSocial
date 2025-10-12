import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const formatMap = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/mov': 'mov',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/ogg': 'ogg',
  'video/avi': 'avi',
  'video/mkv': 'mkv'
};

// Create Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'unisocial',            // folder name in Cloudinary
      format: async (req, file) => {
      return formatMap[file.mimetype] || 'png'; // default to png if unknown
    },
    public_id: (req, file) => Date.now() + '-' + file.originalname
  }
});

export const upload = multer({ storage });
