import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import z from "zod";
import { useSignUp } from "@/libs/store/authToken";

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
  linkText: {
    textAlign: "center",
    color: "#666",
  },
});

const signUpFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .trim()
    .min(8, "パスワードは8文字以上で入力してください"),
});

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

const defaultValues: SignUpFormSchema = {
  email: "",
  password: "",
};

export const SignUp: FC = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(signUpFormSchema),
    defaultValues,
  });

  const { signUp, verifySignUp } = useSignUp();

  const handleSignUp = handleSubmit(async ({ email, password }) => {
    try {
      await signUp(email, password);
      setPendingVerification(true);
      Alert.alert(
        "確認メール送信",
        "確認メールを送信しました。メールに記載された認証コードを入力してください",
      );
    } catch (err: unknown) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "サインアップエラー",
        "サインアップに失敗しました。入力内容を確認してください",
      );
    }
  });

  const handleVerification = async () => {
    try {
      await verifySignUp(verificationCode);
      Alert.alert(
        "サインアップ成功",
        "アカウントが作成されました。ログインしてください",
      );
      router.replace("/login");
    } catch (err: unknown) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "認証エラー",
        "認証に失敗しました。認証コードを確認してください",
      );
    }
  };

  const handleNavigateToLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>サインアップ</Text>
      <Text style={styles.description}>
        {pendingVerification
          ? "メールに記載された認証コードを入力してください"
          : "メールアドレスとパスワードを入力してアカウントを作成"}
      </Text>

      {pendingVerification ? (
        <View style={styles.form}>
          <TextInput
            label="認証コード"
            aria-label="認証コード"
            value={verificationCode}
            onChangeText={setVerificationCode}
            mode="outlined"
            style={styles.input}
            keyboardType="number-pad"
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={handleVerification}
            style={styles.button}
          >
            認証
          </Button>
        </View>
      ) : (
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  label="メールアドレス"
                  aria-label="メールアドレス"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {error && <HelperText type="error">{error.message}</HelperText>}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  label="パスワード"
                  aria-label="パスワード"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {error && <HelperText type="error">{error.message}</HelperText>}
              </View>
            )}
          />
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={handleSignUp}
            style={styles.button}
          >
            サインアップ
          </Button>
          <Button
            mode="text"
            onPress={handleNavigateToLogin}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>
              既にアカウントをお持ちですか? ログイン
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};
