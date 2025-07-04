import type { FC } from "react";
import { TextInput } from "react-native";

export const Input: FC = () => {
  return (
    <TextInput
      className="rounded p-2 border-2"
      placeholder="useless placeholder"
    />
  );
};
