import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res, next) => {   
  //get the details of the user from frontend
  // validation - not empty
  // check if user already exist using either username or email
  // check for images, check for avatar
  //upload them to cloudinary, avatar
  // create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  console.log("body request ",req.body);
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((ele) => ele?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //finding the user either on their email or username
  });

  if (existedUser) {
    throw new Error(409, "User with email or username exist");
  }
  console.log("requested files ",req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("Uploaded avatar ",avatar);

  if (!avatar) {
    throw new Error(400, "Avatar not uploaded");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //removing password and refresh token to the
  );
  
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )
});

export { registerUser };
