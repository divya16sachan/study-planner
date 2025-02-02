import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useNoteStore = create((set, get) => ({
  // BOOLEANS
  isSidebarLoading: false,
  isCreatingCollection: false,
  isDeletingCollection: false,
  isCreatingNote: false,

  collections: [],

  // ======= Utility methods for collections =======
  insertNoteInCollection: (collectionId, note) => {
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection._id === collectionId
          ? { ...collection, notes: [...collection.notes, note] }
          : collection
      ),
    }));
  },

  deleteNoteFromCollection: (noteId) => {
    set((state) => ({
      collections: state.collections.map((collection) => ({
        ...collection,
        notes: collection.notes.filter((note) => note._id !== noteId),
      })),
    }));
  },

  replaceNoteFromCollection: (updatedNote) => {
    set((state) => ({
      collections: state.collections.map((collection) => ({
        ...collection,
        notes: collection.notes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        ),
      })),
    }));
  },

  // ======= Utility methods for collections =======


  createCollection: async (data) => {
    set({ isCreatingCollection: true });
    try {
      const res = await axiosInstance.post('/collection', data);
      const { collection, message } = res.data;
      set((state) => ({
        collections: [...state.collections, collection],
      }));
      toast.success(message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingCollection: false });
    }
  },

  deleteCollection: async (collectionId) => {
    set({ isDeletingCollection: true });
    try {
      const res = await axiosInstance.delete(`/collection/${collectionId}`);
      set((state) => ({
        collections: state.collections.filter(
          (collection) => collection._id !== collectionId
        ),
      }));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingCollection: false });
    }
  },

  getHierarchy: async () => {
    set({ isSidebarLoading: true });
    try {
      const res = await axiosInstance.get('collection/hierarchy');
      set({ collections: res.data.collections });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSidebarLoading: false });
    }
  },

  renameCollection: async (data) => {
    try {
      const res = await axiosInstance.put('collection/', data);
      const { collection, message } = res.data;
      set((state) => ({
        collections: state.collections.map((c) =>
          c._id === collection._id ? collection : c
        )
      }));

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  createNote: async (data) => {
    //data:{name, collectionId }

    set({ isCreatingNote: true });
    const { collectionId } = data;
    try {
      const res = await axiosInstance.post('note/', data);
      const { note, message } = res.data;
      
      // Add note to the appropriate collection
      get().insertNoteInCollection(collectionId, note);

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingNote: false });
    }
  },

  deleteNote: async (noteId) => {
    try {
      const res = await axiosInstance.delete(`note/${noteId}`);

      // Remove the deleted note
      get().deleteNoteFromCollection(noteId);

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  renameNote: async (data) => {
    try {
      const res = await axiosInstance.put('note/rename', data);
      const { note: updatedNote, message } = res.data;

      // Replace note with updated note
      get().replaceNoteFromCollection(updatedNote);

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  moveTo: async (data) => {
    try {
      const res = await axiosInstance.post('/note/move-to', data);
      const { note: updatedNote, message } = res.data;

      // Remove the note from the old collection and add it to the new collection
      get().deleteNoteFromCollection(updatedNote._id);
      get().insertNoteInCollection(updatedNote.collectionId, updatedNote);

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

}));
