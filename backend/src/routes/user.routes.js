import {Router } from "express"
import { refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile, getWatchHistory, loginUser, logout, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import  verifyJwt  from "../middlewares/auth.middleware.js"
const router =Router()

router.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);


import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests"
})

router.route("/login").post(loginLimiter,loginUser)
router.route("/logout").post(verifyJwt,logout)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateAccountDetails)
router.route("/avatar").patch(verifyJwt ,upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel/:username").get(verifyJwt,getUserChannelProfile)
router.route("/watchistory").get(verifyJwt,getWatchHistory)

export default router