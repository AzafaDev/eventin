import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

/**
 * Basic User interface based on the Prisma schema.
 */
interface User {
  id: string;
  fullName: string;
  email: string;
  role: "customer" | "organizer";
  referralCode: string;
  isVerified: boolean;
}

interface AuthState {
  // --- Data State ---
  user: User | null;
  errorMessage: string | null;

  // --- UI & Status State ---
  isOpen: boolean; // Controls Auth Modals/Drawers
  isLoading: boolean; // General loading (buttons, etc.)
  isCheckingAuth: boolean; // Initial session check loading
  isVerified: boolean; // Tracks successful verification flow

  // --- Basic Actions ---
  setIsOpen: (value: boolean) => void;
  setUser: (userData: User | null) => void;
  setIsLoading: (value: boolean) => void;
  resetStates: () => void;

  // --- API Actions ---
  verifyEmail: (email: string, verificationToken: string) => Promise<void>;
  resendEmail: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;

  // --- Password Recovery Actions ---
  forgotPassword: (email: string) => Promise<void>;
  validateTokenResetPassword: (token: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
}

/**
 * Zustand store for managing global Authentication state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Default State
  user: null,
  errorMessage: null,
  isOpen: false,
  isLoading: false,
  isCheckingAuth: false,
  isVerified: false,

  // --- Basic Actions ---
  setIsOpen: (value) => set({ isOpen: value }),
  setUser: (userData) => set({ user: userData }),
  setIsLoading: (value) => set({ isLoading: value }),
  resetStates: () =>
    set({ errorMessage: null, isLoading: false, isVerified: false }),

  // --- API Actions ---

  /**
   * Verifies the user's email with a numeric token.
   */
  verifyEmail: async (email, verificationToken) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await axiosInstance.post("/auth/verify-email", {
        email,
        verificationToken,
      });
      set({ user: response.data.user, isVerified: true });
      toast.success("Account verified successfully!");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Verification failed";
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Triggers a new verification email to be sent.
   */
  resendEmail: async (email) => {
    set({ isLoading: true, errorMessage: null });
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      toast.success("A new code has been sent to your email.");
    } catch (error: any) {
      set({ errorMessage: error?.response?.data?.message });
      throw new Error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Authenticates the user and starts a session.
   */
  login: async (email, password) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: response.data.user, isVerified: true });
      toast.success(`Welcome back, ${response.data.user.fullName}!`);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Persistent session check (runs on app mount).
   */
  checkAuth: async () => {
    set({ isCheckingAuth: true, errorMessage: null });
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ user: response.data.user });
    } catch (error: any) {
      set({ user: null });
      // We don't throw error here to avoid interrupting the initial app load
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  /**
   * Terminates the session and clears local user data.
   */
  logout: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success(response.data.message || "Logged out successfully.");
    } catch (error: any) {
      set({ errorMessage: error?.response?.data?.message });
      throw new Error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- Password Recovery Actions ---

  forgotPassword: async (email) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      set({ errorMessage: error?.response?.data?.message });
      throw new Error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  validateTokenResetPassword: async (token) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await axiosInstance.get(
        `/auth/validate-reset-token/${token}`,
      );
      toast.success(`Valid token for: ${response.data.data.email}`);
    } catch (error: any) {
      set({ errorMessage: error?.response?.data?.message });
      throw new Error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (password, token) => {
    set({ isLoading: true, errorMessage: null });
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated! You can now log in.");
    } catch (error: any) {
      set({ errorMessage: error?.response?.data?.message });
      throw new Error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
