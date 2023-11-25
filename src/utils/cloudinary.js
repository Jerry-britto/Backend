import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //to detect the type of file(audio,video,image,etc..)
        })
        console.log("cloudinary response ",response);
        //file has been uploaded successfully
        // console.log("File is uploaded on cloudinary ",response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        //remove the locally saved temperorary file as the upload is failed
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export {uploadOnCloudinary}