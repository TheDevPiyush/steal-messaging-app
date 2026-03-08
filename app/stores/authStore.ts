import { create } from "zustand";

export const authStore = create((set: any) => ({
    email: "",
    setEmail: (payload: string) => set({ email: payload }),

    token: "",
    setToken: (payload: string) => set({ token: payload })
}));