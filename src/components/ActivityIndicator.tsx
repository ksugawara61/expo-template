import type { FC } from "react";
import { ActivityIndicator as RNActivityIndicator, View } from "react-native";

export interface ActivityIndicatorProps {
  animating?: boolean;
  color?: string;
  size?: "small" | "large" | number;
  hidesWhenStopped?: boolean;
  className?: string;
}

export const ActivityIndicator: FC<ActivityIndicatorProps> = ({
  animating = true,
  color = "#6366f1",
  size = "small",
  hidesWhenStopped = true,
  className,
}) => {
  if (hidesWhenStopped && !animating) {
    return null;
  }

  return (
    <View className={`items-center justify-center ${className || ""}`}>
      <RNActivityIndicator animating={animating} color={color} size={size} />
    </View>
  );
};
