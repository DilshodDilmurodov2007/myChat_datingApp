import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
        } catch (error) {
            console.error("Auth check failed:", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    }, 
    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data})
            toast.success("Account created successfully")
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        } finally {
            set({isSigningUp: false});
        }
    },
    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data})
            toast.success("Logged in successfully")
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        } finally {
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            setTimeout(() => {
                set({authUser: null})
                toast.success("Logged out successfully")
            }, 1000)
        } catch (error) {
            toast.error("Logout error", error)
        }
    },
    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Eror updating profile:", error)
            toast.error("Eror updating profile:", error?.response?.data?.message)
        }
    },
}));