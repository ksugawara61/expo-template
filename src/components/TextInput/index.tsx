import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import {
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  mode?: "flat" | "outlined";
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  error?: boolean;
  secureTextEntry?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  testID?: string;
};

export const TextInput: FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  mode = "outlined",
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  error = false,
  secureTextEntry = false,
  left,
  right,
  onFocus,
  onBlur,
  className,
  testID,
}) => {
  const getInputStyle = () => {
    if (mode === "outlined") {
      return `border-2 rounded-md px-3 py-2 bg-white ${
        error ? "border-red-500" : "border-slate-300"
      } ${disabled ? "bg-slate-100" : ""}`;
    }
    return `border-b-2 px-0 py-2 bg-transparent ${
      error ? "border-red-500" : "border-slate-300"
    }`;
  };

  const getTextColor = () => {
    if (disabled) return "#94a3b8";
    if (error) return "#ef4444";
    return "#1e293b";
  };

  return (
    <View className={`${className || ""}`} testID={testID}>
      {label && (
        <Text
          className={`mb-1 text-sm font-medium ${error ? "text-red-600" : "text-slate-700"}`}
        >
          {label}
        </Text>
      )}
      <View className={`flex-row items-center ${getInputStyle()}`}>
        {left && <View className="mr-2">{left}</View>}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            flex: 1,
            color: getTextColor(),
            fontSize: 16,
            minHeight: multiline ? numberOfLines * 20 : 20,
          }}
        />
        {right && <View className="ml-2">{right}</View>}
      </View>
    </View>
  );
};

export const TextInputIcon: FC<{
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
}> = ({ icon, onPress, color = "#64748b" }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name={icon} size={20} color={color} />
      </TouchableOpacity>
    );
  }
  return <Ionicons name={icon} size={20} color={color} />;
};
