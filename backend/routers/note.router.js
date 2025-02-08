import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
    createNote,
    deleteNote,
    getNote,
    getNotes,
    updateContent,
    renameNote,
    moveTo
} from "../controller/note.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get('/', getNotes);
router.get('/:_id', getNote);
router.post('/', createNote);
router.delete('/:_id', deleteNote);
router.put('/', updateContent);
router.put('/rename', renameNote);
router.post('/move-to', moveTo);

export default router;