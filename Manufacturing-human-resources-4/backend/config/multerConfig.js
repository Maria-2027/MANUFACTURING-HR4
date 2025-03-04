import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js"; 

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "samples/hr4", // Uploads to 'samples/hr3'
      resource_type: "auto", // ✅ Allows images, PDFs, and raw files
      allowed_formats: ["jpg", "png", "pdf", "docx", "txt"], // Add any needed formats
      upload_preset: "ml_default", // ✅ Uses the signed upload preset
      use_filename: true, // ✅ Uses the original filename as the public ID
      unique_filename: false, // ✅ Prevents Cloudinary from generating random names
      overwrite: true, // ✅ Ensures duplicate file uploads replace existing ones
    },
  });

const upload = multer({ storage: storage });

export default upload;