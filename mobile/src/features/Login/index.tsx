import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  Button,
  HelperText,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import z from "zod";
import { useLogin } from "@/libs/store/authToken";

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
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#666",
  },
});

const testFormSchema = z.object({
  userId: z.string().trim().min(1, "ユーザーIDは必須です"),
  testKey: z.string().trim().min(1, "認証キーは必須です"),
});

const emailFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().trim().min(1, "パスワードは必須です"),
});

type TestFormSchema = z.infer<typeof testFormSchema>;
type EmailFormSchema = z.infer<typeof emailFormSchema>;

const testDefaultValues: TestFormSchema = {
  userId: "",
  testKey: "",
};

const emailDefaultValues: EmailFormSchema = {
  email: "",
  password: "",
};

export const Login: FC = () => {
  const [loginMode, setLoginMode] = useState<"email" | "test">("email");

  // テストログイン用のフォーム
  const {
    control: testControl,
    handleSubmit: handleTestSubmit,
    formState: { isSubmitting: isTestSubmitting },
  } = useForm<TestFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(testFormSchema),
    defaultValues: testDefaultValues,
  });

  // Emailログイン用のフォーム
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { isSubmitting: isEmailSubmitting },
  } = useForm<EmailFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(emailFormSchema),
    defaultValues: emailDefaultValues,
  });

  const { login, testLogin } = useLogin();

  const handleTestLogin = handleTestSubmit(({ userId, testKey }) => {
    testLogin({ userId, testKey });
    Alert.alert("ログイン成功", "ログインが完了しました");
  });

  const handleQuickTestLogin = () => {
    testLogin();
    Alert.alert("テストログイン成功", "開発用ログインが完了しました");
  };

  const handleEmailLogin = handleEmailSubmit(async ({ email, password }) => {
    try {
      await login(email, password);
      Alert.alert("ログイン成功", "ログインが完了しました");
    } catch (err: unknown) {
      console.error("Email login error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "ログインエラー",
        "ログインに失敗しました。メールアドレスとパスワードを確認してください",
      );
    }
  });

  const handleNavigateToSignUp = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <Text style={styles.description}>
        {loginMode === "email"
          ? "メールアドレスとパスワードを入力してログイン"
          : "GraphQL APIの認証情報を入力してください"}
      </Text>

      <SegmentedButtons
        value={loginMode}
        onValueChange={(value) => setLoginMode(value as "email" | "test")}
        buttons={[
          { value: "email", label: "Emailログイン" },
          { value: "test", label: "テストログイン" },
        ]}
        style={styles.segmentedButtons}
      />

      {loginMode === "email" ? (
        <View style={styles.form}>
          <Controller
            control={emailControl}
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
            control={emailControl}
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
            loading={isEmailSubmitting}
            onPress={handleEmailLogin}
            style={styles.button}
          >
            ログイン
          </Button>
          <Button
            mode="text"
            onPress={handleNavigateToSignUp}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>
              アカウントをお持ちでないですか? サインアップ
            </Text>
          </Button>
        </View>
      ) : (
        <View style={styles.form}>
          <Controller
            control={testControl}
            name="userId"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  label="ユーザーID"
                  aria-label="ユーザーID"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="none"
                />
                {error && <HelperText type="error">{error.message}</HelperText>}
              </View>
            )}
          />
          <Controller
            control={testControl}
            name="testKey"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  label="認証キー"
                  aria-label="認証キー"
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
            loading={isTestSubmitting}
            onPress={handleTestLogin}
            style={styles.button}
          >
            ログイン
          </Button>

          {__DEV__ && (
            <View style={styles.testButtonContainer}>
              <Text style={styles.testButtonDescription}>
                開発環境用（テスト用の認証情報でログイン）
              </Text>
              <Button
                mode="outlined"
                loading={isTestSubmitting}
                onPress={handleQuickTestLogin}
                style={styles.button}
              >
                テストログイン
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
