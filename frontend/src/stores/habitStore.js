import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: [],
      lastResetDate: new Date().toDateString(),
      
      addHabit: (text) => 
        set((state) => ({
          habits: [...state.habits, { 
            id: Date.now(), 
            text, 
            completed: false,
            streak: 0,
            maxStreak: 0,
            lastCompleted: null
          }],
        })),
      
      toggleHabit: (id) => {
        const now = new Date();
        const today = now.toDateString();
        const yesterday = new Date(now.getTime() - 86400000).toDateString();
        const { habits, lastResetDate } = get();
        
        // Reset all habits if it's a new day
        if (today !== lastResetDate) {
          set({
            habits: habits.map(habit => ({
              ...habit,
              completed: false,
              maxStreak: habit.completed ? Math.max(habit.streak, habit.maxStreak) : habit.maxStreak
            })),
            lastResetDate: today
          });
          return;
        }

        set({
          habits: habits.map(habit => {
            if (habit.id === id) {
              const newCompleted = !habit.completed;
              let newStreak = habit.streak;
              
              if (newCompleted) {
                // When checking, always set streak to 1 if this is the first check today
                // or continue streak if checked yesterday
                if (habit.lastCompleted === yesterday) {
                  newStreak = habit.streak + 1;
                } else {
                  newStreak = 1; // Reset to 1 when checking again same day
                }
              } else {
                // When unchecking, keep streak unless this was completed today
                if (habit.lastCompleted === today) {
                  newStreak = 0;
                }
              }
              
              return {
                ...habit,
                completed: newCompleted,
                streak: newStreak,
                lastCompleted: newCompleted ? today : habit.lastCompleted
              };
            }
            return habit;
          })
        });
      },
      
      updateHabit: (id, newText) =>
        set((state) => ({
          habits: state.habits.map(habit =>
            habit.id === id ? { ...habit, text: newText } : habit
          ),
        })),
      
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter(habit => habit.id !== id),
        })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useHabitStore;