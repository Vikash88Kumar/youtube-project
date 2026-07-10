import { Router } from "express";
import { getUserNotifications, markAllAsRead } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

router.route("/").get(getUserNotifications);
router.route("/mark-all-read").patch(markAllAsRead);

export default router;
