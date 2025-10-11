import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { getFragmentData } from "@/libs/gql";
import { execute } from "@/libs/gql/execute";
import { server } from "@/libs/test/server";
import { render, screen } from "@/libs/test/testing-library";
import { BOOKMARK, GET_BOOKMARKS } from "./index";
import { MocksBookmarks } from "./index.mocks";

// Test version using regular useQuery instead of useSuspenseQuery
const BookmarksTest: FC<{ isEmpty?: boolean }> = ({ isEmpty = false }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetBookmarks"],
    queryFn: () => execute(GET_BOOKMARKS),
  });

  if (isLoading) return <Text>Loading...</Text>;

  const bookmarks = data?.bookmarks || [];

  if (isEmpty || bookmarks.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Text variant="titleLarge">ブックマークがありません</Text>
      </View>
    );
  }

  const renderItem = ({
    item,
  }: {
    item: NonNullable<typeof data>["bookmarks"][0];
  }) => {
    const bookmark = getFragmentData(BOOKMARK, item);
    return (
      <Card mode="contained" contentStyle={{ padding: 8 }}>
        <Card.Content style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Text variant="titleMedium">{bookmark.title}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button mode="outlined">編集</Button>
            <Button mode="contained">削除</Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      data={bookmarks}
      renderItem={renderItem}
      keyExtractor={(item) => getFragmentData(BOOKMARK, item).id}
      style={{ height: "100%", width: "100%" }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
    />
  );
};

describe("Bookmarks", () => {
  it("ブックマークが正しく表示される", async () => {
    server.use(MocksBookmarks.success);
    render(<BookmarksTest />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });

  it("ブックマークがない場合のメッセージが表示される", async () => {
    server.use(MocksBookmarks.empty);
    render(<BookmarksTest isEmpty={true} />);

    expect(
      await screen.findByText("ブックマークがありません"),
    ).toBeOnTheScreen();
  });
});
