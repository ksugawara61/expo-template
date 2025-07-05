import type { FC, ReactNode } from "react";
import { View, Text } from "react-native";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <View
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className || ""}`}
    >
      {children}
    </View>
  );
};

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <View className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}>
      {children}
    </View>
  );
};

export const CardTitle: FC<CardTitleProps> = ({ children, className }) => {
  return (
    <Text
      className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    >
      {children}
    </Text>
  );
};

export const CardDescription: FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <Text className={`text-sm text-slate-500 ${className || ""}`}>
      {children}
    </Text>
  );
};

export const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return <View className={`p-6 pt-0 ${className || ""}`}>{children}</View>;
};

export const CardFooter: FC<CardFooterProps> = ({ children, className }) => {
  return (
    <View className={`flex flex-row items-center p-6 pt-0 ${className || ""}`}>
      {children}
    </View>
  );
};
