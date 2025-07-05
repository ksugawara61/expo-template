import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import { Text, TouchableOpacity } from "react-native";

export type FABProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "surface";
  disabled?: boolean;
  className?: string;
  testID?: string;
};

const fabVariants = {
  primary: "bg-indigo-500 active:bg-indigo-600",
  secondary: "bg-teal-500 active:bg-teal-600",
  surface: "bg-slate-100 active:bg-slate-200",
};

const fabSizes = {
  small: "w-10 h-10",
  medium: "w-14 h-14",
  large: "w-16 h-16",
};

const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
};

export const FAB: FC<FABProps> = ({
  icon = "add",
  label,
  onPress,
  size = "medium",
  variant = "primary",
  disabled = false,
  className,
  testID,
}) => {
  const getIconColor = () => {
    if (variant === "surface") {
      return "#334155";
    }
    return "#ffffff";
  };

  const getTextColor = () => {
    if (variant === "surface") {
      return "text-slate-700";
    }
    return "text-white";
  };

  if (label) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        className={`rounded-full flex-row items-center justify-center px-4 py-3 ${fabVariants[variant]} ${disabled ? "opacity-50" : ""} ${className || ""}`}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={iconSizes[size]} color={getIconColor()} />
        <Text className={`ml-2 font-medium ${getTextColor()}`}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      className={`rounded-full items-center justify-center ${fabSizes[size]} ${fabVariants[variant]} ${disabled ? "opacity-50" : ""} ${className || ""}`}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={iconSizes[size]} color={getIconColor()} />
    </TouchableOpacity>
  );
};
