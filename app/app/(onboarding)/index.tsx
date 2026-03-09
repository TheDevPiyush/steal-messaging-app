import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import {
    Text,
    View,
    SafeAreaView,
    useThemeColor,
} from "@/components/Themed";
import Colors from "@/constants/Colors";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;

export default function UsernameOnboarding() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const bg = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({ light: "#666", dark: "#666" }, "text");
    const inputBg = useThemeColor({ light: "#fffbe7", dark: "#fffbe7" }, "background");
    const borderColor = useThemeColor({ light: "#e0e0e0", dark: "#e0e0e0" }, "background");

    const validate = useCallback((value: string): string => {
        if (!value) return "";
        if (value.length < USERNAME_MIN)
            return `At least ${USERNAME_MIN} characters`;
        if (value.length > USERNAME_MAX)
            return `Maximum ${USERNAME_MAX} characters`;
        if (!USERNAME_REGEX.test(value))
            return "Only letters, numbers, dots and underscores";
        return "";
    }, []);

    const handleChange = (value: string) => {
        const cleaned = value.toLowerCase().replace(/\s/g, "");
        setUsername(cleaned);
        setError(validate(cleaned));
    };

    const isValid = username.length >= USERNAME_MIN && !error;

    const handleContinue = () => {
        Keyboard.dismiss();
        if (!isValid) return;
        // TODO: API call to check availability & save username
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.emoji}>👋</Text>
                        <Text style={[styles.title, { color: textColor }]}>
                            Choose a username
                        </Text>
                        <Text style={[styles.subtitle, { color: subtextColor }]}>
                            Pick something unique — this is how others will find you
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <Text style={[styles.label, { color: subtextColor }]}>
                                Username
                            </Text>
                            <View
                                style={[
                                    styles.inputRow,
                                    {
                                        backgroundColor: inputBg,
                                        borderColor: error
                                            ? "#ff4444"
                                            : username && isValid
                                                ? Colors.appColor.secondary
                                                : borderColor,
                                    },
                                ]}
                            >
                                <Text style={[styles.atSymbol, { color: subtextColor }]}>
                                    @
                                </Text>
                                <TextInput
                                    style={[styles.usernameInput, { color: textColor }]}
                                    placeholder="yourname"
                                    placeholderTextColor={subtextColor}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="username"
                                    maxLength={USERNAME_MAX}
                                    value={username}
                                    onChangeText={handleChange}
                                    onSubmitEditing={handleContinue}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>

                        {/* Hint / Error */}
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : username.length > 0 && isValid ? (
                            <Text style={styles.successText}>Looks good!</Text>
                        ) : (
                            <Text style={[styles.hintText, { color: subtextColor }]}>
                                3–20 characters · letters, numbers, dots, underscores
                            </Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                !isValid && styles.buttonDisabled,
                            ]}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                            disabled={!isValid}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        marginTop: 20,
    },
    header: {
        marginBottom: 40,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    emoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: -0.5,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },
    form: {
        gap: 16,
        marginTop: 15,
    },
    inputWrapper: {
        gap: 8,
        backgroundColor: "transparent",
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 52,
        borderRadius: 14,
        borderWidth: 1.5,
        paddingHorizontal: 16,
    },
    atSymbol: {
        fontSize: 18,
        fontWeight: "600",
        marginRight: 4,
    },
    usernameInput: {
        flex: 1,
        fontSize: 16,
        height: "100%",
    },
    errorText: {
        color: "#ff4444",
        fontSize: 13,
        marginTop: -4,
    },
    successText: {
        color: Colors.appColor.secondary,
        fontSize: 13,
        fontWeight: "500",
        marginTop: -4,
    },
    hintText: {
        fontSize: 13,
        marginTop: -4,
    },
    button: {
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
        backgroundColor: Colors.appColor.primary,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.appColor.whiteColor,
    },
});
