import { useSignUp } from "@clerk/clerk-expo";
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

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("エラー", "アカウント作成に失敗しました");
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    if (!code.trim()) {
      Alert.alert("エラー", "認証コードを入力してください");
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        Alert.alert("エラー", "認証コードが正しくありません");
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("エラー", "認証に失敗しました");
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>メール認証</Text>
        <Text style={styles.description}>
          メールアドレスに送信された認証コードを入力してください
        </Text>

        <View style={styles.form}>
          <TextInput
            label="認証コード"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            style={styles.input}
            keyboardType="number-pad"
          />
          <Button
            mode="contained"
            onPress={onVerifyPress}
            style={styles.button}
          >
            認証
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント作成</Text>
      <Text style={styles.description}>新しいアカウントを作成してください</Text>

      <View style={styles.form}>
        <View style={styles.oauthContainer}>
          <OAuthButton strategy="oauth_google">
            <Text>Googleでアカウント作成</Text>
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
        <Button mode="contained" onPress={onSignUpPress} style={styles.button}>
          アカウント作成
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          style={styles.linkButton}
          labelStyle={styles.linkButtonLabel}
        >
          既にアカウントをお持ちの方はこちら
        </Button>
      </View>
    </View>
  );
};

export default SignUpScreen;
