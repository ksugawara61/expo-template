import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import type { FC } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Divider, List, Text } from "react-native-paper";
import { useAuth } from "@/libs/auth/AuthContext";

export const Settings: FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleNavigateToLicense = () => {
    router.push("/license");
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <List.Item
            title="ライセンス一覧"
            description="オープンソースライセンス情報"
            left={(props) => <List.Icon {...props} icon="file-text" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleNavigateToLicense}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <View style={{ alignItems: "center", paddingVertical: 16 }}>
            <FontAwesome name="sign-out" size={48} color="#ef4444" />
            <Text
              variant="titleMedium"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              ログアウト
            </Text>
            <Text
              variant="bodyMedium"
              style={{ marginBottom: 16, opacity: 0.7, textAlign: "center" }}
            >
              アカウントからログアウトします
            </Text>
            <Divider style={{ width: "100%", marginBottom: 16 }} />
            <Button
              mode="contained"
              onPress={handleLogout}
              buttonColor="#ef4444"
              style={{ width: "100%" }}
            >
              ログアウト
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
