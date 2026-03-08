/**
 * Themed components:
 * - Text
 * - View
 * - SafeAreaView
 *
 * Automatically switches colors based on light/dark mode.
 */

import React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  TextProps as RNTextProps,
  ViewProps as RNViewProps,
} from "react-native";

import {
  SafeAreaView as DefaultSafeAreaView,
  SafeAreaViewProps as RNSafeAreaViewProps,
} from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & RNTextProps;
export type ViewProps = ThemeProps & RNViewProps;
export type SafeAreaViewProps = ThemeProps & RNSafeAreaViewProps;

/* -------------------------------------------------------------------------- */
/*                              THEME COLOR HOOK                              */
/* -------------------------------------------------------------------------- */

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}

/* -------------------------------------------------------------------------- */
/*                                   TEXT                                     */
/* -------------------------------------------------------------------------- */

export function Text({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: TextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return (
    <DefaultText
      style={[{ color, fontFamily: "Inter" }, style]}
      {...otherProps}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   VIEW                                     */
/* -------------------------------------------------------------------------- */

export function View({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              SAFE AREA VIEW                                */
/* -------------------------------------------------------------------------- */

export function SafeAreaView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: SafeAreaViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultSafeAreaView
      style={[{ backgroundColor, flex: 1 }, style]}
      {...otherProps}
    />
  );
}
