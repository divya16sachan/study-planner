import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifyingEmail: false,
  emailStatus: "",
  isUploadingAvatar: false,

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
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/user/signup', data);
      const { message } = res.data;
      toast.success(message);
      return { success: true };
    } catch (error) {
      toast.error(error.response.data.message);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/user/login', data);
      set({ authUser: res.data });
      toast.success("sign up successful");
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post('/user/logout');
      set({ authUser: null });
      toast.success(res.data.message);
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
    }
  },

  verifyEmail: async (data) => {
    set({ isVerifyingEmail: true });
    try {
      const res = await axiosInstance.post('/email/verify-otp', data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  resendEmailOTP: async () => {
    try {
      const res = await axiosInstance('/email/resend-otp');
      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      return { success: false };

    }
  },
  updateUserField: async (apiEndPoint, data) => {
    try {
      let res;
      if (data.newEmail) {
        res = await axiosInstance.post(apiEndPoint, data);
      } else {
        res = await axiosInstance.put(apiEndPoint, data);
      }
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  },

  uploadUserAvatar: async (data) => {
    set({ isUploadingAvatar: true });
    try {
      const res = await axiosInstance.post('/user/upload-avatar', data)
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isUploadingAvatar: false });
    }
  },

  checkEmailStatus: async () => {
    try {
      const res = await axiosInstance.get('email/check-status');
      set({ emailStatus: res.data.status });
      return get().emailStatus;
    } catch (error) {
      console.log(error.response.data.message);
      set({ emailStatus: "" });
    }
  },
})); 