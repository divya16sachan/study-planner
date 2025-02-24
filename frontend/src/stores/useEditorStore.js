import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";


export const useEditorStore = create((set, get) => ({
    imageTrigger: null,
    setImageTrigger: (imageTrigger) => set({ imageTrigger }),
}))