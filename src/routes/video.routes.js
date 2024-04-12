import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideoById, publishVideo, toggleStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJwt); // apply middleware for all routes in this file

// to add a video
router.route("/publishvideo")
    .post(upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),publishVideo); 


router.route("/:videoId")
    .get(getVideoById)  // to get a video by id
    .patch(upload.single("thumbnail"),updateVideo) // to update video details
    .delete(deleteVideo) // to delete a video

// to publish toggle status
router.route("/toggle/publish/:videoId").patch(toggleStatus)

export default router;
