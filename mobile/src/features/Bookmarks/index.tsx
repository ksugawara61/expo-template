import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { type FC, Suspense } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  FAB,
  HelperText,
  Text,
} from "react-native-paper";
import { getFragmentData, graphql } from "@/libs/gql";
import { execute } from "@/libs/gql/execute";
import { graphqlMutate } from "@/libs/graphql/fetcher";
import type { BookmarkFragment } from "./index.msw";

type BookmarkItemProps = {
  bookmark: BookmarkFragment;
  onDelete: (id: string) => void;
  onEdit: (bookmark: BookmarkFragment) => void;
};

const BookmarkItem: FC<BookmarkItemProps> = ({
  bookmark,
  onDelete,
  onEdit,
}) => {
  const handleDelete = () => {
    Alert.alert("ブックマークを削除", "このブックマークを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => onDelete(bookmark.id),
      },
    ]);
  };

  return (
    <Card mode="contained" contentStyle={{ padding: 8 }}>
      <Card.Content style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">{bookmark.title}</Text>
          {bookmark.description && (
            <HelperText type="info">{bookmark.description}</HelperText>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button mode="outlined" onPress={() => onEdit(bookmark)}>
            編集
          </Button>
          <Button mode="contained" onPress={handleDelete}>
            削除
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export const BOOKMARK = graphql(`
  fragment Bookmark on Bookmark {
    created_at
    description
    id
    title
    updated_at
    url
  }
`);

export const GET_BOOKMARKS = graphql(`
  query GetBookmarks {
    bookmarks {
      ...Bookmark
    }
  }
`);

export const DELETE_BOOKMARK = graphql(`
  mutation DeleteBookmark($id: String!) {
    deleteBookmark(id: $id)
  }
`);

export const Bookmarks: FC = () => {
  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={{ marginTop: 16 }}>
            ブックマークを読み込み中...
          </Text>
        </View>
      }
    >
      <Content />
    </Suspense>
  );
};

export const Content: FC = () => {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: ["GetBookmarks"],
    queryFn: () => execute(GET_BOOKMARKS),
  });

  const handleDelete = async (id: string) => {
    try {
      await graphqlMutate(DELETE_BOOKMARK, { id });
      // キャッシュを無効化して再取得
      await queryClient.invalidateQueries({ queryKey: ["GetBookmarks"] });
    } catch {
      Alert.alert("エラー", "ブックマークの削除に失敗しました");
    }
  };

  const handleEdit = (bookmark: BookmarkFragment) => {
    router.push({
      pathname: "/modal",
      params: { bookmark: JSON.stringify(bookmark) },
    });
  };

  const handleAdd = () => {
    router.push("/modal");
  };

  return (
    <>
      <FlatList
        data={data.bookmarks.map((bookmark) =>
          getFragmentData(BOOKMARK, bookmark),
        )}
        style={{ height: "100%", width: "100%" }}
        contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
        renderItem={({ item }) => (
          <BookmarkItem
            bookmark={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        ListEmptyComponent={() => (
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
            <Text variant="bodyMedium">
              右下のボタンから新しいブックマークを追加できます
            </Text>
          </View>
        )}
      />
      <FAB
        icon="plus"
        onPress={handleAdd}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
      />
    </>
  );
};
