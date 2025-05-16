import express from 'express';
import { login, signup, checkAuth} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('check-auth', protectedRoute, checkAuth);

export default router;