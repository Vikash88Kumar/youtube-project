import { Router } from 'express';
import { check } from "../controllers/check.controller.js"

const router = Router();

router.route('/').get(check);

export default router