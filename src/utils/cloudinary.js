import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //to detect the type of file(audio,video,image,etc..)
    });
    console.log("cloudinary response ", response);
    //file has been uploaded successfully
    console.log("File is uploaded on cloudinary ",response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //remove the locally saved temperorary file as the upload is failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    // delete the file from cloudinary
    const image_name = filePath.split("/");
    const public_id = image_name[image_name.length - 1].split(".")[0];
    const response = await cloudinary.uploader.destroy(public_id);
    console.log("deletion response ", response);
    return response;
  } catch (error) {
    console.log("could not delete your old avatar due to ", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
