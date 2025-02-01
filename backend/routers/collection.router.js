import express from 'express';
import { protectRoute } from '../middleware/protectRoute.middleware.js';
import {
    createCollection,
    deleteCollection,
    renameCollection,
    getHierarchy
} from '../controller/collection.controller.js';


const router = express.Router();
router.use(protectRoute);

router.post('/', createCollection);
router.delete('/', deleteCollection);
router.get('/hierarchy', getHierarchy);
router.put('/', renameCollection);

export default router;