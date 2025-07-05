import type { FC } from "react";
import { View } from "react-native";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
  testID?: string;
};

export const Divider: FC<DividerProps> = ({
  orientation = "horizontal",
  className,
  testID,
}) => {
  const getDividerStyle = () => {
    if (orientation === "vertical") {
      return "w-px h-full bg-slate-200";
    }
    return "h-px w-full bg-slate-200";
  };

  return (
    <View
      testID={testID}
      className={`${getDividerStyle()} ${className || ""}`}
    />
  );
};
