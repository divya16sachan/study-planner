import Routine from "../models/routine.model.js";

// 📖 Get all routines for a user (returns weekly structure)
export const getRoutines = async (req, res) => {
  try {
    // Get userId from authenticated user (adjust based on your auth middleware)
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    let routine = await Routine.findOne({ userId });
    
    // If no routine exists, create one with empty arrays
    if (!routine) {
      routine = new Routine({
        userId,
        Sun: [],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
      });
      await routine.save();
    }
    
    res.status(200).json({
      weeklyRoutines: {
        Sun: routine.Sun || [],
        Mon: routine.Mon || [],
        Tue: routine.Tue || [],
        Wed: routine.Wed || [],
        Thu: routine.Thu || [],
        Fri: routine.Fri || [],
        Sat: routine.Sat || [],
      }
    });
  } catch (error) {
    console.error("Error fetching routines:", error);
    res.status(500).json({ message: error.message });
  }
};

// ➕ Add a new routine to a specific day
export const addRoutine = async (req, res) => {
  try {
    const { day } = req.params; // Sun, Mon, Tue, etc.
    const userId = req.user?._id || req.user?.id;
    const newRoutine = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    // Validate day
    const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }
    
    // Validate required fields
    if (!newRoutine.time || !newRoutine.endTime || !newRoutine.subject) {
      return res.status(400).json({ 
        message: "Missing required fields: time, endTime, and subject are required" 
      });
    }
    
    // Find or create routine document
    let routine = await Routine.findOne({ userId });
    if (!routine) {
      routine = new Routine({ 
        userId,
        Sun: [],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
      });
    }
    
    // Add new routine to the specific day
    routine[day].push({
      time: newRoutine.time,
      endTime: newRoutine.endTime,
      subject: newRoutine.subject,
      description: newRoutine.description || ""
    });
    
    await routine.save();
    
    // Return the updated day's routines
    res.status(201).json(routine[day]);
  } catch (error) {
    console.error("Error adding routine:", error);
    res.status(400).json({ message: error.message });
  }
};

// ✏️ Update a routine on a specific day
export const updateRoutine = async (req, res) => {
  try {
    const { day, index } = req.params;
    const userId = req.user?._id || req.user?.id;
    const updatedRoutine = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }
    
    const routine = await Routine.findOne({ userId });
    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }
    
    const routineIndex = parseInt(index);
    if (isNaN(routineIndex) || routineIndex < 0 || routineIndex >= routine[day].length) {
      return res.status(404).json({ message: "Routine item not found" });
    }
    
    // Update the specific routine
    routine[day][routineIndex] = {
      time: updatedRoutine.time,
      endTime: updatedRoutine.endTime,
      subject: updatedRoutine.subject,
      description: updatedRoutine.description || ""
    };
    
    // Mark the array as modified for Mongoose
    routine.markModified(day);
    
    await routine.save();
    res.status(200).json(routine[day]);
  } catch (error) {
    console.error("Error updating routine:", error);
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete a routine from a specific day
export const deleteRoutine = async (req, res) => {
  try {
    const { day, index } = req.params;
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }
    
    const routine = await Routine.findOne({ userId });
    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }
    
    const routineIndex = parseInt(index);
    if (isNaN(routineIndex) || routineIndex < 0 || routineIndex >= routine[day].length) {
      return res.status(404).json({ message: "Routine item not found" });
    }
    
    // Remove the routine at the specified index
    routine[day].splice(routineIndex, 1);
    
    // Mark the array as modified for Mongoose
    routine.markModified(day);
    
    await routine.save();
    res.status(200).json(routine[day]);
  } catch (error) {
    console.error("Error deleting routine:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get routine by ID (kept for backward compatibility)
export const getRoutineById = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) return res.status(404).json({ message: "Routine not found" });
    res.status(200).json(routine);
  } catch (error) {
    console.error("Error fetching routine by ID:", error);
    res.status(500).json({ message: error.message });
  }
};