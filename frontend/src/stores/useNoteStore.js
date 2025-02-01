import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useNoteStore = create((set, get) => ({
  // BOOLEANS
  isHierarchyLoading: false,
  isCreatingCollection: false,
  isDeletingCollection: false,

  collections: [],

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
    set({ isHierarchyLoading: true });
    try {
      const res = await axiosInstance.get('collection/hierarchy');
      set({ collections: res.data.collections });
      console.log("res", res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isHierarchyLoading: false });
    }
  },
}));
