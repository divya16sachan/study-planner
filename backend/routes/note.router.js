// routes/noteRoutes.js
import express from 'express';
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from '../controllers/note.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';

const router = express.Router();
router.use(protectedRoute);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;