import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //assigning refreshToken in the user document of mongodb
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

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

  // console.log("body request ",req.body);
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((ele) => ele?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //finding the user either on their email or username
  });

  if (existedUser) {
    throw new Error(409, "User with email or username already exist");
  }
  console.log("requested files ", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("Uploaded avatar ", avatar);

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

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  /*
    steps to login user
    1. req body -> data
    2. username or email 
    3. find the user
    4. password check 
    5. access and refresh token
    6. send the access and refresh token to the user via cookies
  */

  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    //find user based on email or username
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async(req,res,next)=>{
  //removing refresh token from database
  await User.findByIdAndUpdate(req.user._id,{
    $set:{
      refreshToken:undefined
    }
  },
  {
    new:true  
  })

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out"));
})

export { registerUser, loginUser,logoutUser };
