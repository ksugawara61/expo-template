import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import { TouchableOpacity, View } from "react-native";

export type CheckboxProps = {
  status: "checked" | "unchecked" | "indeterminate";
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  testID?: string;
};

export const Checkbox: FC<CheckboxProps> = ({
  status,
  onPress,
  disabled = false,
  className,
  testID,
}) => {
  const getCheckboxStyle = () => {
    const baseStyle = "w-5 h-5 rounded border-2 items-center justify-center";

    if (status === "checked") {
      return `${baseStyle} bg-indigo-500 border-indigo-500`;
    }
    if (status === "indeterminate") {
      return `${baseStyle} bg-indigo-500 border-indigo-500`;
    }
    return `${baseStyle} bg-transparent border-slate-400`;
  };

  const getIconName = () => {
    if (status === "checked") return "checkmark";
    if (status === "indeterminate") return "remove";
    return undefined;
  };

  const getIconColor = () => {
    if (status === "checked" || status === "indeterminate") {
      return "#ffffff";
    }
    return "transparent";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      className={`${disabled ? "opacity-50" : ""} ${className || ""}`}
      activeOpacity={0.7}
    >
      <View className={getCheckboxStyle()}>
        {getIconName() && (
          <Ionicons name={getIconName()} size={12} color={getIconColor()} />
        )}
      </View>
    </TouchableOpacity>
  );
};
