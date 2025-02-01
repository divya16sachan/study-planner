import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useNoteStore = create((set, get) => ({
    // BOOLEANS
    isHierarchyLoading: false,
    isCreatingCollection: false,

    hierarchy: null,

    createCollection: async (data)=>{
        set({ isCreatingCollection: true });
        try {
            const res = await axiosInstance.post('/collection');
            console.log(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({ isCreatingCollection: false });
        }
    },

    getHierarchy: async () => {
        set({ isHierarchyLoading: true });
        try {
            const res = await axiosInstance.get('collection/hierarchy');
            console.log("res", res.data);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({ isHierarchyLoading: false });
        }
    },

}));