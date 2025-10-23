import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { updateAuthHeaders } from "@/libs/graphql/urql";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  form: {
    gap: 15,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  status: {
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statusDetail: {
    fontSize: 14,
    color: "#666",
  },
});

const LoginScreen = () => {
  const [userId, setUserId] = useState("test-user");
  const [testKey, setTestKey] = useState("test-key");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (!userId.trim() || !testKey.trim()) {
      Alert.alert("エラー", "ユーザーIDとテストキーを入力してください");
      return;
    }

    // ログイン処理
    setIsLoggedIn(true);

    // GraphQLクライアントのヘッダーを更新
    updateAuthHeaders(userId.trim(), testKey.trim());

    Alert.alert(
      "ログイン成功",
      "開発用ログインが完了しました\nGraphQLクライアントのヘッダーが更新されました",
    );
    console.log("ログイン情報:", { userId, testKey });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);

    // GraphQLクライアントのヘッダーをクリア
    updateAuthHeaders(null, null);

    Alert.alert(
      "ログアウト",
      "ログアウトしました\nGraphQLクライアントのヘッダーがリセットされました",
    );
  };

  if (!__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>本機能は開発環境でのみ利用可能です</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>開発用ログイン</Text>
      <Text style={styles.description}>
        GraphQL APIのテスト用認証ヘッダーを設定します
      </Text>

      {!isLoggedIn ? (
        <View style={styles.form}>
          <TextInput
            label="ユーザーID"
            value={userId}
            onChangeText={setUserId}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="テストキー"
            value={testKey}
            onChangeText={setTestKey}
            mode="outlined"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            ログイン
          </Button>
        </View>
      ) : (
        <View style={styles.status}>
          <Text style={styles.statusText}>ログイン中</Text>
          <Text style={styles.statusDetail}>ユーザーID: {userId}</Text>
          <Text style={styles.statusDetail}>テストキー: {testKey}</Text>
          <Button mode="outlined" onPress={handleLogout} style={styles.button}>
            ログアウト
          </Button>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
