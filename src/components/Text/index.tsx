import type { FC, PropsWithChildren } from "react";
import { Text as RNText } from "react-native";

export type TextProps = {
  variant?:
    | "displayLarge"
    | "displayMedium"
    | "displaySmall"
    | "headlineLarge"
    | "headlineMedium"
    | "headlineSmall"
    | "titleLarge"
    | "titleMedium"
    | "titleSmall"
    | "labelLarge"
    | "labelMedium"
    | "labelSmall"
    | "bodyLarge"
    | "bodyMedium"
    | "bodySmall";
  className?: string;
  testID?: string;
};

const textVariants = {
  displayLarge: "text-6xl font-normal",
  displayMedium: "text-5xl font-normal",
  displaySmall: "text-4xl font-normal",
  headlineLarge: "text-3xl font-normal",
  headlineMedium: "text-2xl font-normal",
  headlineSmall: "text-xl font-normal",
  titleLarge: "text-lg font-medium",
  titleMedium: "text-base font-medium",
  titleSmall: "text-sm font-medium",
  labelLarge: "text-sm font-medium",
  labelMedium: "text-xs font-medium",
  labelSmall: "text-xs font-medium",
  bodyLarge: "text-base font-normal",
  bodyMedium: "text-sm font-normal",
  bodySmall: "text-xs font-normal",
};

export const Text: FC<PropsWithChildren<TextProps>> = ({
  variant = "bodyMedium",
  className,
  testID,
  children,
}) => {
  return (
    <RNText
      testID={testID}
      className={`text-slate-900 ${textVariants[variant]} ${className || ""}`}
    >
      {children}
    </RNText>
  );
};
