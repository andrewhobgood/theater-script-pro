import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler';

// Configure multer for memory storage (we'll upload to S3, not disk)
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.', 400));
  }
};

// Configure upload limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max file size
};

// Create multer upload instances
export const uploadScript = multer({
  storage,
  fileFilter,
  limits,
}).single('script');

export const uploadCoverImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid image type. Only JPEG, PNG, and WebP images are allowed.', 400));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for images
  },
}).single('coverImage');