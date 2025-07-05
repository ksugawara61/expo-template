import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import { Text, View } from "react-native";

export type HelperTextProps = {
  type?: "info" | "error";
  visible?: boolean;
  children: string;
  className?: string;
  testID?: string;
};

const helperTextVariants = {
  info: "text-slate-600",
  error: "text-red-600",
};

export const HelperText: FC<HelperTextProps> = ({
  type = "info",
  visible = true,
  children,
  className,
  testID,
}) => {
  if (!visible) {
    return null;
  }

  const getIcon = () => {
    if (type === "error") {
      return <Ionicons name="alert-circle-outline" size={14} color="#dc2626" />;
    }
    return (
      <Ionicons name="information-circle-outline" size={14} color="#64748b" />
    );
  };

  return (
    <View
      testID={testID}
      className={`flex-row items-center mt-1 ${className || ""}`}
    >
      {getIcon()}
      <Text className={`ml-1 text-sm ${helperTextVariants[type]}`}>
        {children}
      </Text>
    </View>
  );
};
