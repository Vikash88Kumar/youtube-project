import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { chatHistory, createChatRooms, createMessage, getallChatRooms } from "../controllers/chat.controller.js";
const router=Router();

router.use(verifyJwt)
router.route("/create-chatroom").post(createChatRooms)
router.route("/:chatId/create-message").post(createMessage)
router.route("/getallchatrooms").get(getallChatRooms)
router.route("/:chatId/chatHistory").get(chatHistory)

export default router