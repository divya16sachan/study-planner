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
    isRenaming: false,
    isResettingPassword: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get('/auth/me');
            set({ authUser: response.data.user, isCheckingAuth: false });
            return response.data;
        } catch (error) {
            console.error("Check auth error:", error);
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
        set({ isRenaming: true });
        try {
            const response = await axiosInstance.post('/user/update-name', { name: newName });
            set({ authUser: response.data.user });
            toast.success(response.data.message || "Name updated!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update name");
            return null;
        } finally {
            set({ isRenaming: false });
        }
    },

    updateEmail: async ({ newEmail, otp }) => {
        set({ isUpdatingEmail: true });
        try {
            const response = await axiosInstance.post('/user/update-email', { newEmail, otp });
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

    sendEmailUpdateOtp: async (newEmail) => {
        console.log(newEmail)
        set({ isSendingOtp: true });
        try {
            const response = await axiosInstance.post('/user/send-email-update-otp', { newEmail });
            toast.success(response.data.message || "OTP sent successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            console.error("Send OTP error:", error);
            return null;
        } finally {
            set({ isSendingOtp: false });
        }
    },

    requestResetPasswordOtp: async (email) => {
        set({ isSendingOtp: true });
        try {
            const response = await axiosInstance.post('/password/request-reset-password-otp', {
                email,
            });
            toast.success(response.data.message || "OTP sent successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            console.error("Request reset password OTP error:", error);
            return null;
        } finally {
            set({ isSendingOtp: false });
        }
    },

    resetPassword: async ({ email, newPassword, otp }) => {
        set({ isResettingPassword: true });
        try {
            const response = await axiosInstance.post('/password/reset-password', {
                email,
                newPassword,
                otp,
            });
            toast.success(response.data.message || "Password reset successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
            console.error("Reset password error:", error);
            return null;
        } finally {
            set({ isResettingPassword: false });
        }
    },

    googleLogin: async ({ token }) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/google-login', { token });

            set({ authUser: response.data.user, isLoggingIn: false });
            toast.success(response.data.message || "Login successful!");
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.error || "Login failed. Please try again.");
            return null;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfilePicture: async (formData) => {
        set({ isUploadingFile: true });
        try {
            const response = await axiosInstance.post('/user/update-profile-picture', formData);
            set({ authUser: response.data.user });
            toast.success(response.data.message || "Profile picture updated successfully!");
            return response.data;
        } catch (error) {
            console.error("Update profile picture error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile picture");
            return null;
        } finally {
            set({ isUploadingFile: false });
        }
    },

    getUserByEmail: async (email) => {
        try {
            const response = await axiosInstance.get(`/user/${email}`);
            console.log(response.data.user);
            return response.data.user;
        } catch (error) {
            return null;
        }
    }
}));

