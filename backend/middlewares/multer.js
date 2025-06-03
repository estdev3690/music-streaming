import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".mp3", ".wav", ".webp", ".jpg", ".png", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeTypeValid =
    file.mimetype.startsWith("audio/") || file.mimetype.startsWith("image/");
  const isExtensionValid = allowedExtensions.includes(ext);
  if (isMimeTypeValid && isExtensionValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid File type"));
  }
};

// Use memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

export default upload;
