import { Stack } from "expo-router";

export default function AuthRootLayout() {
    return (
        <Stack>
            <Stack.Screen
                options={{ headerShown: false }}
                name="index" />
        </Stack>
    );
}
