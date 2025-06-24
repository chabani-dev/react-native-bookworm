// Description: This module configures the Cloudinary client with the necessary credentials and settings.
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";


// Check if the required Cloudinary configuration is provided
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;