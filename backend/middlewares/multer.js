import multer from "multer";
import path from "path";

const MIME_TYPE_MAP = {
  // Audio types
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/wave': '.wav',
  // Image types
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype.toLowerCase();
  const extension = MIME_TYPE_MAP[mimeType];
  
  if (!extension) {
    return cb(new Error(`Unsupported file type: ${mimeType}`));
  }

  // Validate based on field name
  if (file.fieldname === 'music' && !mimeType.startsWith('audio/')) {
    return cb(new Error('Music file must be an audio file'));
  }
  
  if (file.fieldname === 'image' && !mimeType.startsWith('image/')) {
    return cb(new Error('Image file must be an image file'));
  }

  cb(null, true);
};

// Use memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export default upload;
