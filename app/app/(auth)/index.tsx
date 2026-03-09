import React,
{
    useState,
    useRef, useEffect
} from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
    type NativeSyntheticEvent,
    type TextInputKeyPressEventData,
} from "react-native";
import {
    Text,
    View,
    SafeAreaView,
    useThemeColor
} from "@/components/Themed";
import Colors from "@/constants/Colors";
import { sendCode, verifyCode } from "@/apis/auth";
import { getMe } from "@/apis/user";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";

const OTP_LENGTH = 6;

export default function Login() {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);

    const otpRefs = useRef<(TextInput | null)[]>([]);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const bg = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const tint = useThemeColor({}, "tint");
    const subtextColor2 = useThemeColor({ light: "#666", dark: "#666" }, "text");
    const subtextColor = useThemeColor({ light: "#666666c6", dark: "#666666c6" }, "text");
    const inputBg = useThemeColor({ light: "#fffbe7", dark: "#fffbe7" }, "background");
    const borderColor = useThemeColor({ light: "#e0e0e0", dark: "#e0e0e0" }, "background");

    const setAuth = useAuthStore((s) => s.setAuth);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const animateTransition = (callback: () => void) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            callback();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleSendOtp = async () => {
        setError("");
        if (!isValidEmail(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }
        setLoading(true);
        Keyboard.dismiss();

        try {
            const data = await sendCode(email);
            console.log(data);
        } catch (e: any) {
            console.log(e)
            setError(e.message);
        } finally {
            setLoading(false)
            setStep("otp");
        }

    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, "").split("").slice(0, OTP_LENGTH);
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < OTP_LENGTH) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
            otpRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value.replace(/\D/g, "");
        setOtp(newOtp);
        setError("");

        if (value && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
        }
    };

    const handleVerifyOtp = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setError("Please enter the complete OTP");
            return;
        }
        setLoading(true);
        Keyboard.dismiss();
        try {
            const data = await verifyCode(email, code);
            // console.log("-------",data.token)
            const user = await getMe(data.token);
            console.log(code)
            console.log(data.token)
            setAuth(data.token, user);

            router.replace("/(home)");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        if (countdown > 0) return;
        setOtp(Array(OTP_LENGTH).fill(""));
        setCountdown(30);
        setError("");
        handleSendOtp()
    };

    const handleBackToEmail = () => {
        setError("");
        setOtp(Array(OTP_LENGTH).fill(""));
        animateTransition(() => setStep("email"));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: textColor }]}>
                            {step === "email" ? "Steal" : "Verify your email"}
                        </Text>
                        <Text style={[styles.subtitle, { color: subtextColor }]}>
                            {step === "email"
                                ? "Let's get you set up real quick."
                                : `We sent a code to ${email}`}
                        </Text>
                    </View>

                    {/* Email Step */}
                    {step === "email" && (
                        <View style={styles.form}>
                            <View style={styles.inputWrapper}>
                                <Text style={[styles.label, { color: subtextColor2 }]}>
                                    Email
                                </Text>
                                <TextInput
                                    style={[
                                        styles.emailInput,
                                        {
                                            backgroundColor: inputBg,
                                            color: textColor,
                                            borderColor: error ? "#ff4444" : borderColor,
                                        },
                                    ]}
                                    placeholder="you@example.com"
                                    placeholderTextColor={subtextColor}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="email"
                                    value={email}
                                    onChangeText={(t) => {
                                        setEmail(t);
                                        setError("");
                                    }}
                                    onSubmitEditing={handleSendOtp}
                                    returnKeyType="next"
                                    editable={!loading}
                                />
                                <Text style={[styles.label2, { color: subtextColor }]}>
                                    Only you can view your email - Steal never shows your email to anyone
                                </Text>
                            </View>

                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    loading && styles.buttonDisabled,
                                ]}
                                onPress={handleSendOtp}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Continue</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* OTP Step */}
                    {step === "otp" && (
                        <View style={styles.form}>
                            <View style={styles.otpRow}>
                                {otp.map((digit, i) => (
                                    <TextInput
                                        key={i}
                                        ref={(ref) => {
                                            otpRefs.current[i] = ref;
                                        }}
                                        style={[
                                            styles.otpBox,
                                            {
                                                backgroundColor: inputBg,
                                                color: textColor,
                                                borderColor: digit
                                                    ? Colors.appColor.secondary
                                                    : error
                                                        ? "#ff4444"
                                                        : borderColor,
                                            },
                                        ]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(v) => handleOtpChange(v, i)}
                                        onKeyPress={(e) => handleOtpKeyPress(e, i)}
                                        selectTextOnFocus
                                        editable={!loading}
                                    />
                                ))}
                            </View>

                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (loading || otp.join("").length < OTP_LENGTH) &&
                                    styles.buttonDisabled,
                                ]}
                                onPress={handleVerifyOtp}
                                activeOpacity={0.8}
                                disabled={loading || otp.join("").length < OTP_LENGTH}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify</Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.otpFooter}>
                                <TouchableOpacity
                                    onPress={handleResendOtp}
                                    disabled={countdown > 0}
                                >
                                    <Text
                                        style={[
                                            styles.linkText,
                                            {
                                                color:
                                                    countdown > 0 ? subtextColor : Colors.appColor.secondary,
                                            },
                                        ]}
                                    >
                                        {countdown > 0
                                            ? `Resend code in ${countdown}s`
                                            : "Resend code"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleBackToEmail}>
                                    <Text style={[styles.linkText, { color: Colors.appColor.secondary }]}>
                                        Change email
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        alignContent: "center",
        marginTop: 20,
    },
    header: {
        marginBottom: 40,
        backgroundColor: "transparent",
        alignContent: "center",
        fontFamily: "Inter"
    },
    logo: {
        fontSize: 32,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        letterSpacing: -0.5,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center'
    },
    form: {
        gap: 16,
        marginTop: 15
    },
    inputWrapper: {
        gap: 5,
        backgroundColor: "transparent",
    },
    label: {
        fontSize: 14,
        paddingHorizontal: 8

    },
    label2: {
        fontSize: 11,
        paddingHorizontal: 8
    },
    emailInput: {
        height: 52,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1.5,
    },
    button: {
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
        backgroundColor: Colors.appColor.primary
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        color: Colors.appColor.whiteColor
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        backgroundColor: "transparent",
    },
    otpBox: {
        flex: 1,
        height: 56,
        borderRadius: 14,
        borderWidth: 1.5,
        textAlign: "center",
        fontSize: 22,
    },
    errorText: {
        color: "#ff4444",
        fontSize: 13,
        marginTop: -4,
    },
    otpFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
        backgroundColor: "transparent",
    },
    linkText: {
        fontSize: 14,
    },
});
