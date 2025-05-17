import { create } from 'zustand';
import { axiosInstance } from '../lib/axiosInstance.js';
import { toast } from "sonner"


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: false,
    isSigningUp: false,
    isLoggingIn: false,
    isSendingOtp: false,
    isUpdatingEmail: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            set({ authUser: response.data.user, isCheckingAuth: false });
            return response.data;
        } catch (error) {
            console.error("Check auth error:", error);
            toast.error(error.response?.data?.message || "Failed to check authentication.");
            return null;
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', data);
            set({ authUser: response.data.user, isLoggingIn: false });
            toast.success(response.data.message || "Login successful!");
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            return null;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', data);
            set({
                authUser: response.data.user,
                isSigningUp: false
            });
            toast.success(response.data.message || "Signup successful!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
            console.error("Signup error:", error);
            return null;
        } finally {
            set({ isSigningUp: false });
        }
    },

    sendSignupOtp: async (email) => {
        set({ isSendingOtp: true });
        try {
            const response = await axiosInstance.post('/auth/send-signup-otp', { email });
            toast.success(response.data.message || "OTP sent successfully!");
            return response.data;
        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
            console.error("Send OTP error:", error);
            return null;
        } finally {
            set({ isSendingOtp: false });
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success(response.data.message || "Logout successful!");
            return response.data;
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
            return null;
        }
    },

    updateName: async (newName) => {
        try {
            const response = await axiosInstance.post('/auth/update-name', { name: newName });
            set({ authUser: response.data.user });
            toast.success(response.data.message || "Name updated!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update name");
            return null;
        }
    },

    updateEmail: async ({ newEmail, otp }) => {
        set({ isUpdatingEmail: false });
        try {
            const response = await axiosInstance.post('/auth/update-email', { newEmail, otp });
            set({ authUser: response.data.user });
            toast.success(response.data.message || "Email updated!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update email");
            return null;
        } finally {
            set({ isUpdatingEmail: false });
        }
    },

    sendEmailUpdateOtp: async (email) => {
        set({ isSendingOtp: true });
        try {
            const response = await axiosInstance.post('/auth/send-email-update-otp', { email });
            toast.success(response.data.message || "OTP sent successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            console.error("Send OTP error:", error);
            return null;
        } finally {
            set({ isSendingOtp: false });
        }
    }

}));
