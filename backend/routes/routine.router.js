import express from "express";
import {
  addRoutine,
  getRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
} from "../controllers/routine.controller.js";
import protectedRoute from "../middlewares/protected.middleware.js";

const router = express.Router();
router.use(protectedRoute);

router.post("/", addRoutine);
router.get("/", getRoutines);
router.get("/:id", getRoutineById);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;
