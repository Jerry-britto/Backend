import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const videoPath = req.files?.videoFile[0]?.path;

  if (!videoPath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailPath = req.files?.thumbnail[0]?.path;

  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const uploadedVideo = await uploadOnCloudinary(videoPath);
  if (!uploadedVideo) {
    throw new ApiError(400, "Video not uploaded");
  }
  console.log("uploaded video", uploadedVideo);

  const uploadThumbNail = await uploadOnCloudinary(thumbnailPath);
  if (!uploadThumbNail) {
    throw new ApiError(400, "Thumbnail not uploaded");
  }

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadThumbNail.url,
    title,
    description,
    duration: uploadedVideo.duration,
    owner: req.user?._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Something went wrong while uploading the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Uploaded video successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim()) {
    throw new ApiError(400, "Kindly enter the video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video with the provided video id does not exist");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Retrieved video succesfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Kindly provide your video id");
  }

  const { newTitle, newDescription } = req.body;

  if (!newTitle || !newDescription) {
    throw new ApiError(
      400,
      "Kindly Enter your updated info regarding the video"
    );
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "No Video Exists of the provided video id");
  }

  const thumnailLocalPath = req.file?.path;

  if (!thumnailLocalPath) {
    throw new ApiError(400, "Kindly provide new thumbnail");
  }
  console.log("Video exists", video);
  // delete old thumb nail
  const respnse = await deleteFromCloudinary(video.thumbnail);
  if (respnse.result != "ok") {
    throw new ApiError(500, "Your old thumbnail was not deleted");
  }

  // upload new thumb nail
  const newThumnail = await uploadOnCloudinary(thumnailLocalPath);
  if (!newThumnail.url) {
    throw new ApiError(500, "Thumbnail not updated");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: newTitle,
        description: newDescription,
        thumbnail: newThumnail.url,
      },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiResponse(400, "Kindly provide the video id");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, "Your video was not deleted");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Kindly provide your video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  video.isPublished = !video.isPublished

  const updatedVideo = await video.save()

  return res.status(201).json(new ApiResponse(200,updatedVideo,"Toggled published status"))
});

const getAllVideos = asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const videos = await Video.aggregate([
        {
            $match:{
                query
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"users"
            }
        },
        {
            $project:{
                 
            }
        }
    ])
})
export { publishVideo, getVideoById, updateVideo, deleteVideo, toggleStatus };
