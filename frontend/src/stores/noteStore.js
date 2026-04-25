// stores/noteStore.js
import { axiosInstance } from '@/lib/axiosInstance';
import { create } from 'zustand';

const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Fetch all notes
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/notes');
      set({ notes: response.data.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch notes',
        isLoading: false 
      });
    }
  },

  // Add new note
  addNote: async (title, description) => {
    set({ isCreating: true, error: null });
    try {
      const response = await axiosInstance.post('/notes', {
        title,
        description
      });
      set((state) => ({
        notes: [response.data.data, ...state.notes],
        isCreating: false
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create note',
        isCreating: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Update note
  updateNote: async (id, title, description) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await axiosInstance.put(`/notes/${id}`, {
        title,
        description
      });
      set((state) => ({
        notes: state.notes.map(note =>
          note._id === id ? response.data.data : note
        ),
        isUpdating: false
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update note',
        isUpdating: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Delete note
  deleteNote: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await axiosInstance.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter(note => note._id !== id),
        isDeleting: false
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete note',
        isDeleting: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useNoteStore;
