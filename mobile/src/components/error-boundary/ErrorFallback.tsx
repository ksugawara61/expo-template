import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            エラーが発生しました
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            申し訳ございませんが、アプリケーションでエラーが発生しました。
            以下のボタンを押して再試行してください。
          </Text>
          {__DEV__ && (
            <View style={styles.errorDetails}>
              <Text variant="labelLarge" style={styles.errorTitle}>
                エラー詳細（開発モードのみ）:
              </Text>
              <Text variant="bodySmall" style={styles.errorMessage}>
                {error.message}
              </Text>
            </View>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={resetErrorBoundary}>
            再試行
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    maxWidth: 400,
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    color: "#d32f2f",
  },
  description: {
    textAlign: "center",
    marginBottom: 16,
  },
  errorDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  errorMessage: {
    fontFamily: "monospace",
    color: "#d32f2f",
  },
});
