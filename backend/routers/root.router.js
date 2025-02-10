import express from "express";
import {uploadImage, removeImage, getImages} from '../controller/root.controller.js';
import { protectRoute } from "../middleware/protectRoute.middleware.js";
const router = express.Router();

router.post('/upload-image', protectRoute, uploadImage);
router.post('/remove-image', protectRoute, removeImage);
router.get('/images', protectRoute, getImages);
export default router;