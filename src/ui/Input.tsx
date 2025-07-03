import type { FC } from "react";
import { TextInput } from "react-native";

export const Input: FC = () => {
  return (
    <TextInput
      className="ring-2 rounded p-2"
      placeholder="useless placeholder"
    />
  );
};
