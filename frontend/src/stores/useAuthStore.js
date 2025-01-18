import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "sonner"

export const useAuthStore = create((get, set) => ({
    authUser: null,
    isSigningIn: false,
    isLogingIn: false,
    isVerifyingEmail: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/user/check/auth');
            set({ authUser: res.data });
        } catch (error) {
            set({ authUser: null });
        }
    },

    signup: async (data) => {
        set({ isSigningIn: true });
        try {
            const res = await axiosInstance.post('/user/signup', data);
            set({ authUser: res.data });
            toast.success("Sign up successfull.");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningIn: false });
        }
    },

    login: async (data) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post('/user/login', data);
            set({ authUser: res.data });
            toast.success("Log in successfull.");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingIn: false });
        }
    },


}))