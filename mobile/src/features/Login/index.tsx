import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import z from "zod";
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

const formSchema = z.object({
  userId: z.string().trim().min(1, "ユーザーIDは必須です"),
  testKey: z.string().trim().min(1, "認証キーは必須です"),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  userId: "",
  testKey: "",
};

export const Login: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { login, testLogin } = useAuth();

  const handleLogin = handleSubmit((data) => {
    login(data.userId, data.testKey);
    Alert.alert("ログイン成功", "ログインが完了しました");
  });

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
        <Controller
          control={control}
          name="userId"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View>
              <TextInput
                label="ユーザーID"
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
          control={control}
          name="testKey"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View>
              <TextInput
                label="認証キー"
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
          onPress={handleLogin}
          style={styles.button}
        >
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
            loading={isSubmitting}
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
