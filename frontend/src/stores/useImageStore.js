import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useImageStore = create((set, get) => ({
    imageUrls: [],
    isImageUrlsLoading: false,

    getImages: async () => {
        set({ isImageUrlsLoading: true });
        try {
            const res = await axiosInstance.get('/images');
            const { imageUrls } = res.data;
            localStorage.setItem("imageCount", imageUrls.length);
            set({ imageUrls: imageUrls });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isImageUrlsLoading: false });
        }
    },

    uploadImage: async (imageBase64) => {
        try {
            const res = await axiosInstance.post('/upload-image', { imageBase64 });
            const { message, imageUrls } = res.data;
            localStorage.setItem("imageCount", imageUrls.length);
            set({ imageUrls: imageUrls });
            toast.success(message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    removeImage: async (imageUrl) => {
        try {
            const res = await axiosInstance.post('/remove-image', { imageUrl });
            const { message, imageUrls, success } = res.data;
            if (success) {
                localStorage.setItem("imageCount", imageUrls.length);
                set({ imageUrls: imageUrls });
                toast.success(message);
            }
            else {
                toast.error(message);
            }
            return success;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}))