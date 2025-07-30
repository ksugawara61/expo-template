import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type SegmentedButtonOption = {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
};

export type SegmentedButtonsProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedButtonOption[];
  multiSelect?: boolean;
  className?: string;
  testID?: string;
};

export const SegmentedButtons: FC<SegmentedButtonsProps> = ({
  value,
  onValueChange,
  options,
  multiSelect = false,
  className,
  testID,
}) => {
  const isSelected = (optionValue: string) => {
    if (multiSelect) {
      return value.split(",").includes(optionValue);
    }
    return value === optionValue;
  };

  const handlePress = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = value ? value.split(",") : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onValueChange(newValues.join(","));
    } else {
      onValueChange(optionValue);
    }
  };

  return (
    <View
      testID={testID}
      className={`flex-row bg-slate-100 rounded-lg p-1 ${className || ""}`}
    >
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => handlePress(option.value)}
            disabled={option.disabled}
            className={`flex-1 flex-row items-center justify-center px-3 py-2 ${
              isFirst ? "rounded-l-md" : ""
            } ${isLast ? "rounded-r-md" : ""} ${
              selected ? "bg-white shadow-sm" : "bg-transparent"
            } ${option.disabled ? "opacity-50" : ""}`}
            activeOpacity={0.7}
          >
            {option.icon && (
              <Ionicons
                name={option.icon}
                size={16}
                color={selected ? "#1e293b" : "#64748b"}
                style={{ marginRight: option.label ? 4 : 0 }}
              />
            )}
            {option.label && (
              <Text
                className={`text-sm font-medium ${
                  selected ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {option.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
