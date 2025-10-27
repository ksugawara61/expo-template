import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
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
  segmentedButtons: {
    marginBottom: 20,
  },
});

const LoginScreen = () => {
  const [loginType, setLoginType] = useState<"email" | "test">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [testKey, setTestKey] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, testLogin, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
        Alert.alert("アカウント作成成功", "アカウントが作成されました");
      } else {
        await signInWithEmail(email.trim(), password);
        Alert.alert("ログイン成功", "ログインが完了しました");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "認証に失敗しました";
      Alert.alert("エラー", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    if (!userId.trim() || !testKey.trim()) {
      Alert.alert("エラー", "ユーザーIDとテストキーを入力してください");
      return;
    }

    login(userId.trim(), testKey.trim());
    Alert.alert("ログイン成功", "ログインが完了しました");
  };

  const handleQuickTestLogin = () => {
    testLogin();
    Alert.alert("テストログイン成功", "開発用ログインが完了しました");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <Text style={styles.description}>アプリにログインしてください</Text>

      <SegmentedButtons
        value={loginType}
        onValueChange={(value) => setLoginType(value as "email" | "test")}
        buttons={[
          { value: "email", label: "メールログイン" },
          { value: "test", label: "テスト認証" },
        ]}
        style={styles.segmentedButtons}
      />

      {loginType === "email" ? (
        <View style={styles.form}>
          <TextInput
            label="メールアドレス"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            label="パスワード"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
          <Button
            mode="outlined"
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.button}
          >
            {isSignUp ? "ログインに切り替え" : "アカウント作成に切り替え"}
          </Button>
          <Button
            mode="contained"
            onPress={handleEmailAuth}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {isSignUp ? "アカウント作成" : "ログイン"}
          </Button>
        </View>
      ) : (
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
          <Button
            mode="contained"
            onPress={handleTestLogin}
            style={styles.button}
          >
            ログイン
          </Button>
        </View>
      )}

      {__DEV__ && (
        <View style={styles.testButtonContainer}>
          <Text style={styles.testButtonDescription}>
            開発環境用（デフォルトのテスト用認証情報でログイン）
          </Text>
          <Button
            mode="outlined"
            onPress={handleQuickTestLogin}
            style={styles.button}
          >
            クイックテストログイン
          </Button>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
