import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJwt,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt,changeCurrentPassword);
router.route("/getCurrentUser").post(verifyJwt,getCurrentUser);
router.route("/updateAccountDetails").post(verifyJwt,updateAccountDetails);
router.route("/updateavatar").post(verifyJwt,upload,updateUserAvatar);
router.route("/updateCoverImg").post(verifyJwt,upload,updateUserCoverImage);

export default router;
