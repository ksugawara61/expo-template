import type { FC } from "react";
import { Switch as RNSwitch } from "react-native";

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
  testID?: string;
};

export const Switch: FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  color = "#6366f1",
  testID,
}) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: "#e2e8f0", true: color }}
      thumbColor={value ? "#ffffff" : "#f1f5f9"}
      ios_backgroundColor="#e2e8f0"
      testID={testID}
      style={{ opacity: disabled ? 0.5 : 1 }}
    />
  );
};
