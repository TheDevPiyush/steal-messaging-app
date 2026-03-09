import { useAuthStore } from "@/stores/authStore";

const API = process.env.EXPO_PUBLIC_BACKEND_API_URL;

export const getMe = async (token: string) => {
    const res = await fetch(`${API}/user/@me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
        useAuthStore.getState().logout();
        throw new Error("Session expired. Please log in again.");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");

    return data.data;
};
