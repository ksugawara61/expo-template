import { type FC, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "@/libs/auth/AuthContext";

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
  testButtonContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  testButtonDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#999",
  },
});

export const Login: FC = () => {
  const [userId, setUserId] = useState("");
  const [testKey, setTestKey] = useState("");
  const { login, testLogin } = useAuth();

  const handleLogin = () => {
    if (!userId.trim() || !testKey.trim()) {
      Alert.alert("エラー", "ユーザーIDとテストキーを入力してください");
      return;
    }

    login(userId.trim(), testKey.trim());
    Alert.alert("ログイン成功", "ログインが完了しました");
  };

  const handleTestLogin = () => {
    testLogin();
    Alert.alert("テストログイン成功", "開発用ログインが完了しました");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <Text style={styles.description}>
        GraphQL APIの認証情報を入力してください
      </Text>

      <View style={styles.form}>
        <TextInput
          label="ユーザーID"
          value={userId}
          onChangeText={setUserId}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="認証キー"
          value={testKey}
          onChangeText={setTestKey}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          ログイン
        </Button>
      </View>

      {__DEV__ && (
        <View style={styles.testButtonContainer}>
          <Text style={styles.testButtonDescription}>
            開発環境用（テスト用の認証情報でログイン）
          </Text>
          <Button
            mode="outlined"
            onPress={handleTestLogin}
            style={styles.button}
          >
            テストログイン
          </Button>
        </View>
      )}
    </View>
  );
};
