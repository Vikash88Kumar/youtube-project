import { Router } from 'express';
import {
    getLikedVideos,
    getLikedperVideo,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedTweets,
    getLikedComments
} from "../controllers/like.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/get/v/:videoId").get(getLikedperVideo);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/tweets/:tweetId").get(getLikedTweets);
router.route("/comments/:commentId").get(getLikedComments)
router.route("/videos").get(getLikedVideos);

export default router