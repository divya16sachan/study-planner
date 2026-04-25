import { axiosInstance } from "@/lib/axiosInstance";
import { create } from "zustand";

const useRoutineStore = create((set) => ({
  weeklyRoutines: {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  },
  isLoading: false,
  isSaving: false,
  error: null,

  // 📥 Fetch routines from DB
  fetchRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/routines");
      const data = res.data;
      
      // Transform flat array to weekly structure
      const weeklyRoutines = {
        Sun: [],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
      };

      // If data is already in weekly format
      if (data.weeklyRoutines) {
        set({ weeklyRoutines: data.weeklyRoutines, isLoading: false });
      } else if (Array.isArray(data)) {
        // If data is array of routines, organize by day
        data.forEach((routine) => {
          Object.keys(weeklyRoutines).forEach((day) => {
            if (routine[day] && routine[day].length > 0) {
              weeklyRoutines[day] = routine[day];
            }
          });
        });
        set({ weeklyRoutines, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching routines:", err);
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // ➕ Add routine to DB
  addRoutine: async (day, routine) => {
    set({ isSaving: true, error: null });
    try {
      const res = await axiosInstance.post(`/routines/${day}`, routine);
      
      const updatedDay = res.data;
      
      set((state) => ({
        weeklyRoutines: { ...state.weeklyRoutines, [day]: updatedDay },
        isSaving: false,
      }));
      
      return { success: true };
    } catch (err) {
      console.error("Error adding routine:", err);
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isSaving: false });
      return { success: false, error: errorMessage };
    }
  },

  // ✏️ Update routine in DB
  updateRoutine: async (day, index, routine) => {
    set({ isSaving: true, error: null });
    try {
      const res = await axiosInstance.put(`/routines/${day}/${index}`, routine);
      
      const updatedDay = res.data;
      
      set((state) => ({
        weeklyRoutines: { ...state.weeklyRoutines, [day]: updatedDay },
        isSaving: false,
      }));
      
      return { success: true };
    } catch (err) {
      console.error("Error updating routine:", err);
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isSaving: false });
      return { success: false, error: errorMessage };
    }
  },

  // ❌ Delete routine from DB
  deleteRoutine: async (day, index) => {
    set({ isSaving: true, error: null });
    try {
      const res = await axiosInstance.delete(`/routines/${day}/${index}`);
      
      const updatedDay = res.data;
      
      set((state) => ({
        weeklyRoutines: { ...state.weeklyRoutines, [day]: updatedDay },
        isSaving: false,
      }));
      
      return { success: true };
    } catch (err) {
      console.error("Error deleting routine:", err);
      const errorMessage = err.response?.data?.message || err.message;
      set({ error: errorMessage, isSaving: false });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useRoutineStore;