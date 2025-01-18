import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((get, set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningIn: false,
  isLoginingIn: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/user/check/auth');
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post('/user/signup', data);
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isSigningIn: false });
    }
  },

  login: async (data) => {
    set({ isLoginingIn: true });
    try {
      const res = await axiosInstance.post('/user/login', data);
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isLoginingIn: false });
    }
  },
})); 