import type { FC } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  titleClassName?: string;
};

const buttonVariants = {
  default: "bg-slate-900 active:bg-slate-900/90",
  destructive: "bg-red-500 active:bg-red-500/90",
  outline: "border-2 border-slate-200 bg-transparent active:bg-slate-100",
  secondary: "bg-slate-100 active:bg-slate-100/80",
  ghost: "bg-transparent active:bg-slate-100",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 py-1",
  lg: "h-12 px-8 py-3",
};

const textVariants = {
  default: "text-slate-50 font-medium",
  destructive: "text-white font-medium",
  outline: "text-slate-900 font-medium",
  secondary: "text-slate-900 font-medium",
  ghost: "text-slate-900 font-medium",
};

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  className,
  titleClassName,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-md items-center justify-center flex-row ${buttonVariants[variant]} ${buttonSizes[size]} ${isDisabled ? "opacity-50" : ""} ${className || ""}`}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" ||
            variant === "secondary" ||
            variant === "ghost"
              ? "#1e293b"
              : "#ffffff"
          }
          className="mr-2"
        />
      )}
      <Text className={`${textVariants[variant]} ${titleClassName || ""}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
