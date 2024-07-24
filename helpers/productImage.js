require('dotenv').config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadFiles = async (fileBuffers) => {
    try {
        const urls = [];
        for (const fileBuffer of fileBuffers) {
            const result = await new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: "Product-images",
                };
                const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error.message);
                        reject(error);
                    } else {
                        console.log("Cloudinary upload result:", result);
                        resolve(result.secure_url);
                    }
                });
                stream.end(fileBuffer);
            });
            urls.push(result);
        }
        return urls;
    } catch (error) {
        console.error("Error uploading files:", error.message);
        throw new Error("Error uploading files.");
    }
};

module.exports = { uploadFiles };
