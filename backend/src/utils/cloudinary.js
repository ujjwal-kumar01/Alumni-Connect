import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileUploaderOnCloudinary= async (LocalFilePath) => {
    try {
        if(!LocalFilePath) return null;
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto",
        })
        //if file is loaded successfully, delete the file from local storage
        console.log("file is uploaded successfully", response.secure_url)
        fs.unlinkSync(LocalFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(LocalFilePath) // reoving as the file may contain malwares 
        console.log("Error while uploading file to cloudinary", error)
        return null
    }
}

export {fileUploaderOnCloudinary}
