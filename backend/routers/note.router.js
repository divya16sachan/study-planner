import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { createNote, deleteNote} from "../controller/note.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post('/', createNote);
router.delete('/:_id', deleteNote);

export default router;