require('dotenv').config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadFiles = async (fileBuffers) => {
    try {
        const urls = await Promise.all(fileBuffers.map(fileBuffer =>
            new Promise((resolve, reject) => {
                const uploadOptions = { folder: "Product-images" };
                const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error.message);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                });
                stream.end(fileBuffer);
            })
        ));
        return urls;
    } catch (error) {
        console.error("Error uploading files:", error.message);
        throw new Error("Error uploading files.");
    }
};

module.exports = { uploadFiles };
