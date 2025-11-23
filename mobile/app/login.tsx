import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { useAuth } from "@/libs/auth/AuthContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 10,
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
  divider: {
    marginVertical: 30,
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
  switchModeButton: {
    marginTop: 15,
  },
  verificationContainer: {
    marginTop: 20,
  },
  verificationDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
});

type AuthMode = "signin" | "signup" | "verify";

const LoginScreen = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Legacy auth (for GraphQL API)
  const [userId, setUserId] = useState("");
  const [testKey, setTestKey] = useState("");
  const {
    login,
    testLogin,
    clerkEmailLogin,
    clerkEmailSignUp,
    clerkEmailVerify,
  } = useAuth();

  const handleClerkSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    const result = await clerkEmailLogin(email.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert("ログイン成功", "ログインが完了しました");
    } else {
      Alert.alert("ログインエラー", result.error || "ログインに失敗しました");
    }
  };

  const handleClerkSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    const result = await clerkEmailSignUp(email.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      setMode("verify");
      Alert.alert("確認コード送信", "メールアドレスに確認コードを送信しました");
    } else {
      Alert.alert(
        "サインアップエラー",
        result.error || "サインアップに失敗しました",
      );
    }
  };

  const handleClerkVerify = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("エラー", "確認コードを入力してください");
      return;
    }

    setLoading(true);
    const result = await clerkEmailVerify(verificationCode.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert("認証成功", "アカウントが作成されました");
      setMode("signin");
      setVerificationCode("");
    } else {
      Alert.alert("認証エラー", result.error || "認証に失敗しました");
    }
  };

  const handleLegacyLogin = () => {
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
    <ScrollView style={styles.container}>
      <View style={styles.scrollContainer}>
        <Text style={styles.title}>ログイン</Text>
        <Text style={styles.description}>
          メールアドレスでログインまたは新規登録
        </Text>

        {mode === "verify" ? (
          <View style={styles.verificationContainer}>
            <Text style={styles.sectionTitle}>メール確認</Text>
            <Text style={styles.verificationDescription}>
              {email}に送信された確認コードを入力してください
            </Text>
            <View style={styles.form}>
              <TextInput
                label="確認コード"
                value={verificationCode}
                onChangeText={setVerificationCode}
                mode="outlined"
                style={styles.input}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
              <Button
                mode="contained"
                onPress={handleClerkVerify}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                確認
              </Button>
              <Button
                mode="text"
                onPress={() => setMode("signup")}
                style={styles.switchModeButton}
              >
                サインアップに戻る
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {mode === "signin" ? "メールログイン" : "新規登録"}
            </Text>
            <View style={styles.form}>
              <TextInput
                label="メールアドレス"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
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
                mode="contained"
                onPress={
                  mode === "signin" ? handleClerkSignIn : handleClerkSignUp
                }
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                {mode === "signin" ? "ログイン" : "サインアップ"}
              </Button>
              <Button
                mode="text"
                onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
                style={styles.switchModeButton}
              >
                {mode === "signin"
                  ? "アカウントをお持ちでない方はこちら"
                  : "アカウントをお持ちの方はこちら"}
              </Button>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>GraphQL API認証 (レガシー)</Text>
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
                onPress={handleLegacyLogin}
                style={styles.button}
              >
                ログイン
              </Button>
            </View>

            {__DEV__ && (
              <View style={styles.testButtonContainer}>
                <Text style={styles.testButtonDescription}>
                  開発環境用(テスト用の認証情報でログイン)
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
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
