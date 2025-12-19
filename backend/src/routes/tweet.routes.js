import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    getAllTweete,
    updateTweet,
} from "../controllers/tweet.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js"
import {upload } from "../middlewares/multer.middleware.js"
const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/").post( upload.single("image"),createTweet);
router.route("/").get(getAllTweete)
router.route("/:username/post").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router