import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { OAuthButton } from "@/components/auth/OAuthButton";

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
  linkButton: {
    marginTop: 20,
  },
  linkButtonLabel: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 20,
  },
  oauthContainer: {
    marginBottom: 20,
  },
});

const LoginScreen = () => {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded || !setActive) return;

    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert(
          "エラー",
          "ログインに失敗しました。認証情報を確認してください。",
        );
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("エラー", "ログインに失敗しました");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <Text style={styles.description}>アカウントにログインしてください</Text>

      <View style={styles.form}>
        <View style={styles.oauthContainer}>
          <OAuthButton strategy="oauth_google">
            <Text>Googleでログイン</Text>
          </OAuthButton>
        </View>

        <Divider style={styles.divider} />

        <TextInput
          label="メールアドレス"
          value={emailAddress}
          onChangeText={setEmailAddress}
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
        <Button mode="contained" onPress={onSignInPress} style={styles.button}>
          ログイン
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/signup" as never)}
          style={styles.linkButton}
          labelStyle={styles.linkButtonLabel}
        >
          アカウントをお持ちでない方はこちら
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
