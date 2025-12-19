import { Router } from 'express';
import {
    deleteComment,
    getVideoComments,
    getTweetComments,
    updateComment,
    addVideoComment,
    addTweetComment,
} from "../controllers/comment.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addVideoComment);
router.route("/t/:tweetId").get(getTweetComments).post(addTweetComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router