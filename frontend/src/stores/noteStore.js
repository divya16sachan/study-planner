import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useNoteStore = create(
  persist(
    (set) => ({
      notes: [],
      addNote: (title, description) => 
        set((state) => ({
          notes: [...state.notes, { 
            id: Date.now(), 
            title, 
            description,
            createdAt: new Date().toISOString() 
          }],
        })),
      updateNote: (id, title, description) =>
        set((state) => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, title, description } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter(note => note.id !== id),
        })),
    }),
    {
      name: 'note-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useNoteStore;