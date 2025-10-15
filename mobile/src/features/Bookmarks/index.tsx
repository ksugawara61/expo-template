import { router } from "expo-router";
import { type FC, Suspense } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  FAB,
  HelperText,
  Text,
} from "react-native-paper";
import {
  type FragmentOf,
  graphql,
  readFragment,
} from "@/libs/graphql/gql-tada";
import { useMutation, useSuspenseQuery } from "@/libs/graphql/urql";

export const BOOKMARK = graphql(`
  fragment Bookmark on Bookmark {
    created_at
    description
    id
    tags {
      id
      name
    }
    title
    updated_at
    url
  }
`);

type BookmarkItemProps = {
  bookmark: FragmentOf<typeof BOOKMARK>;
  onDelete: (id: string) => void;
  onEdit: (bookmark: FragmentOf<typeof BOOKMARK>) => void;
};

const BookmarkItem: FC<BookmarkItemProps> = ({ onDelete, onEdit, ...rest }) => {
  const bookmark = readFragment(BOOKMARK, rest.bookmark);
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
          {bookmark.tags && bookmark.tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {bookmark.tags.map((tag) => (
                <Chip key={tag.id} compact>
                  {tag.name}
                </Chip>
              ))}
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button mode="outlined" onPress={() => onEdit(rest.bookmark)}>
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

export const GET_BOOKMARKS = graphql(
  `
  query GetBookmarks {
    bookmarks {
      ...Bookmark
    }
  }
`,
  [BOOKMARK],
);

export const DELETE_BOOKMARK = graphql(`
  mutation DeleteBookmark($id: String!) {
    deleteBookmark(id: $id)
  }
`);

export const Content: FC = () => {
  const [{ data }] = useSuspenseQuery({ query: GET_BOOKMARKS });

  const [, deleteBookmark] = useMutation(DELETE_BOOKMARK);
  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark({ id }, { additionalTypenames: ["Bookmark"] });
    } catch {
      Alert.alert("エラー", "ブックマークの削除に失敗しました");
    }
  };

  const handleEdit = (bookmark: FragmentOf<typeof BOOKMARK>) => {
    router.push({
      pathname: "/modal",
      params: { bookmark: JSON.stringify(readFragment(BOOKMARK, bookmark)) },
    });
  };

  const handleAdd = () => {
    router.push("/modal");
  };

  return (
    <>
      <FlatList
        data={data.bookmarks}
        style={{ height: "100%", width: "100%" }}
        contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
        renderItem={({ item }) => {
          return (
            <BookmarkItem
              bookmark={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          );
        }}
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
