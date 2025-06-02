import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
filename: (req, file, cb) => {
  const timestamp = Date.now();
  const ext = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, ext);
  const safeName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // remove spaces/special chars
  cb(null, `${timestamp}_${safeName}${ext}`);
}

});

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

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
