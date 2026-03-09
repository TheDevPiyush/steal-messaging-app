const API = process.env.EXPO_PUBLIC_BACKEND_API_URL;

export const sendCode = async (email: string) => {
    const res = await fetch(`${API}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send code");
    return data.data;
};

export const verifyCode = async (email: string, code: string) => {
    const res = await fetch(`${API}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    // console.log("******",data)
    if (!res.ok) throw new Error(data.message || "Verification failed");
    return data.data;
};