import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useRoutineStore = create(
  persist(
    (set) => ({
      weeklyRoutines: {
        Sun: [],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
      },
      setWeeklyRoutines: (weeklyRoutines) => set({ weeklyRoutines }),
      addRoutine: (day, routine) => 
        set((state) => ({
          weeklyRoutines: {
            ...state.weeklyRoutines,
            [day]: [...state.weeklyRoutines[day], routine],
          },
        })),
      updateRoutine: (day, index, routine) =>
        set((state) => {
          const updatedRoutines = [...state.weeklyRoutines[day]];
          updatedRoutines[index] = routine;
          return {
            weeklyRoutines: {
              ...state.weeklyRoutines,
              [day]: updatedRoutines,
            },
          };
        }),
      deleteRoutine: (day, index) =>
        set((state) => ({
          weeklyRoutines: {
            ...state.weeklyRoutines,
            [day]: state.weeklyRoutines[day].filter((_, i) => i !== index),
          },
        })),
    }),
    {
      name: 'weekly-routines-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

export default useRoutineStore;