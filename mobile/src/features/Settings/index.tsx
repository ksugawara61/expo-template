import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import type { FC } from "react";
import { Alert, ScrollView } from "react-native";
import { Button, Card, List } from "react-native-paper";

export const Settings: FC = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
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
            left={(props) => (
              <List.Icon {...props} icon="file-document-outline" />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleNavigateToLicense}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            buttonColor="#ef4444"
            icon="logout"
            style={{ width: "100%" }}
          >
            ログアウト
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
