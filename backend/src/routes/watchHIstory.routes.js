import { Router } from 'express';
import verifyJwt from "../middlewares/auth.middleware.js"
import { addVideoTowatchHistory, getWatchHistory, removeWatchHistory } from '../controllers/watchhistory.controller.js';

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file


router.route("/")
    .get(getWatchHistory)
    .delete(removeWatchHistory)
router.route("/:videoId").post(addVideoTowatchHistory)  

export default router