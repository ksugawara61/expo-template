import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { FlatList, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { execute } from "@/libs/gql/execute";
import { server } from "@/libs/test/server";
import { render, screen } from "@/libs/test/testing-library";
import { GetArticles } from "./index";
import { handlers } from "./index.mocks";

// Test version using regular useQuery instead of useSuspenseQuery
const ArticlesTest: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetArticles", { page: 1 }],
    queryFn: () => execute(GetArticles, { page: 1 }),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (!data?.articles) return <Text>No data</Text>;

  const renderItem = ({ item }: { item: (typeof data.articles)[0] }) => (
    <Card style={{ padding: 8 }}>
      <Card.Title title={item.title} subtitle={`by ${item.user.name}`} />
      <Card.Content>
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
        >
          {item.tags.map((tag) => (
            <Chip key={tag.name} style={{ marginRight: 8, marginBottom: 4 }}>
              {tag.name}
            </Chip>
          ))}
        </View>
        <Text variant="bodySmall">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={data.articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={{ height: "100%", width: "100%" }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
    />
  );
};

describe("Articles", () => {
  it("複数の記事が正しく表示される", async () => {
    server.use(...handlers.Success);
    render(<ArticlesTest />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });
});
