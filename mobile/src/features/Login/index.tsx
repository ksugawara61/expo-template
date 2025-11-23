import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import z from "zod";
import { useLogin } from "@/libs/store/authToken";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
});

const emailFormSchema = z.object({
  email: z.string().trim().email("有効なメールアドレスを入力してください"),
  password: z.string().trim().min(8, "パスワードは8文字以上で入力してください"),
});

const testFormSchema = z.object({
  userId: z.string().trim().min(1, "ユーザーIDは必須です"),
  testKey: z.string().trim().min(1, "認証キーは必須です"),
});

type EmailFormSchema = z.infer<typeof emailFormSchema>;
type TestFormSchema = z.infer<typeof testFormSchema>;

const emailDefaultValues: EmailFormSchema = {
  email: "",
  password: "",
};

const testDefaultValues: TestFormSchema = {
  userId: "",
  testKey: "",
};

export const Login: FC = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { isSubmitting: isEmailFormSubmitting },
  } = useForm<EmailFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(emailFormSchema),
    defaultValues: emailDefaultValues,
  });

  const {
    control: testControl,
    handleSubmit: handleTestSubmit,
    formState: { isSubmitting: isTestSubmitting },
  } = useForm<TestFormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(testFormSchema),
    defaultValues: testDefaultValues,
  });

  const { testLogin } = useLogin();

  const handleEmailLogin = handleEmailSubmit(async ({ email, password }) => {
    if (!isLoaded) {
      return;
    }

    setIsEmailSubmitting(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Sign in attempt:",
          JSON.stringify(signInAttempt, null, 2),
        );
        Alert.alert("ログインエラー", "ログインに失敗しました");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message?: string }> };
      console.error("Email login error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "ログインエラー",
        error.errors?.[0]?.message || "ログインに失敗しました",
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  });

  const handleTestFormLogin = handleTestSubmit(({ userId, testKey }) => {
    testLogin({ userId, testKey });
    Alert.alert("ログイン成功", "ログインが完了しました");
  });

  const handleTestLogin = () => {
    testLogin();
    Alert.alert("テストログイン成功", "開発用ログインが完了しました");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>ログイン</Text>
        <Text style={styles.description}>
          メールアドレスでログイン、またはGraphQL
          APIの認証情報を入力してください
        </Text>

        {/* Email Login Section */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>メールアドレスでログイン</Text>
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
            loading={isEmailSubmitting || isEmailFormSubmitting}
            onPress={handleEmailLogin}
            style={styles.button}
          >
            メールアドレスでログイン
          </Button>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Test Login Section */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>GraphQL API認証</Text>
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
            onPress={handleTestFormLogin}
            style={styles.button}
          >
            GraphQL API認証でログイン
          </Button>
        </View>

        {__DEV__ && (
          <View style={styles.testButtonContainer}>
            <Text style={styles.testButtonDescription}>
              開発環境用（テスト用の認証情報でログイン）
            </Text>
            <Button
              mode="outlined"
              loading={isTestSubmitting}
              onPress={handleTestLogin}
              style={styles.button}
            >
              テストログイン
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
