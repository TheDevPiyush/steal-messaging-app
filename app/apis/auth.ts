export const sendCode = async (email: string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/auth/send-code`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    const data = res.json() as any
    return data.data;
}
export const verifyCode = async (email: string, code: string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, code: code })
    })
    const data = res.json() as any;
    return data.data;
}