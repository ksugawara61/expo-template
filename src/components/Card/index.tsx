import type { FC, PropsWithChildren } from "react";
import { Text, View } from "react-native";

export type CardProps = {
  className?: string;
};

export type CardHeaderProps = {
  className?: string;
};

export type CardTitleProps = {
  className?: string;
};

export type CardDescriptionProps = {
  className?: string;
};

export type CardContentProps = {
  className?: string;
};

export type CardFooterProps = {
  className?: string;
};

export const Card: FC<PropsWithChildren<CardProps>> = ({
  children,
  className,
}) => {
  return (
    <View
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className || ""}`}
    >
      {children}
    </View>
  );
};

export const CardHeader: FC<PropsWithChildren<CardHeaderProps>> = ({
  children,
  className,
}) => {
  return (
    <View className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}>
      {children}
    </View>
  );
};

export const CardTitle: FC<PropsWithChildren<CardTitleProps>> = ({
  children,
  className,
}) => {
  return (
    <Text
      className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    >
      {children}
    </Text>
  );
};

export const CardDescription: FC<PropsWithChildren<CardDescriptionProps>> = ({
  children,
  className,
}) => {
  return (
    <Text className={`text-sm text-slate-500 ${className || ""}`}>
      {children}
    </Text>
  );
};

export const CardContent: FC<PropsWithChildren<CardContentProps>> = ({
  children,
  className,
}) => {
  return <View className={`p-6 pt-0 ${className || ""}`}>{children}</View>;
};

export const CardFooter: FC<PropsWithChildren<CardFooterProps>> = ({
  children,
  className,
}) => {
  return (
    <View className={`flex flex-row items-center p-6 pt-0 ${className || ""}`}>
      {children}
    </View>
  );
};
