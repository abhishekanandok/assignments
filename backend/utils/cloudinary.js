const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Attempt to detect cloud name from URL if missing from ENV
let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
if (!cloudName && process.env.CLOUDINARY_URL) {
    // Extract from cloudinary://...
    const match = process.env.CLOUDINARY_URL.match(/@([^/]+)$/);
    if (match) cloudName = match[1];
}

cloudinary.config({
    cloud_name: cloudName || 'du8g8i9y7', // fallback or placeholder
    api_key: process.env["clodinary-api-key"],
    api_secret: process.env["clodinary-api-secret"]
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine resource type based on mime
        let resource_type = 'auto';
        let format = 'auto';
        if (file.mimetype === 'application/pdf') {
            resource_type = 'image'; // Needed to generate PDF previews easily
            format = 'pdf';
        } else if (file.mimetype.includes('image')) {
            resource_type = 'image';
        } else {
            resource_type = 'raw';
        }

        return {
            folder: 'ai_evaluator_uploads',
            format: format,
            resource_type: resource_type,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    },
});

const uploadCloud = multer({
    storage: storage,
    limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 }
});

module.exports = { cloudinary, uploadCloud };
