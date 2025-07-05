import type { FC, ReactNode } from "react";
import { Text, View } from "react-native";

export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const badgeVariants = {
  default: "bg-slate-900 text-slate-50",
  secondary: "bg-slate-100 text-slate-900",
  destructive: "bg-red-500 text-white",
  outline: "border border-slate-200 bg-transparent text-slate-900",
};

export const Badge: FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
}) => {
  return (
    <View
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${badgeVariants[variant]} ${className || ""}`}
    >
      <Text className="text-xs font-semibold">{children}</Text>
    </View>
  );
};
