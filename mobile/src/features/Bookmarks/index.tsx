import { useMutation, useSuspenseQuery } from "@apollo/client";
import { router } from "expo-router";
import { type FC, Suspense } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  CardContent,
  CardHeader,
  FAB,
  HelperText,
  Text,
} from "@/components";
import { getFragmentData, graphql } from "@/libs/gql";
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
    <Card className="mx-4 my-2">
      <CardHeader>
        <Text variant="titleMedium">{bookmark.title}</Text>
        {bookmark.description && (
          <HelperText>{bookmark.description}</HelperText>
        )}
      </CardHeader>
      <CardContent>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            onPress={() => onEdit(bookmark)}
            className="flex-1"
            title="編集"
          />
          <Button
            variant="destructive"
            onPress={handleDelete}
            className="flex-1"
            title="削除"
          />
        </View>
      </CardContent>
    </Card>
  );
};

export const BOOKMARK = graphql(`
  fragment Bookmark on Bookmark {
    id
    title
    url
    description
    created_at
    updated_at
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" className="mt-4">
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
  const {
    data: { bookmarks },
    error,
    refetch,
  } = useSuspenseQuery(GET_BOOKMARKS);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK, {
    refetchQueries: [{ query: GET_BOOKMARKS }],
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark({ variables: { id } });
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

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text variant="headlineSmall" className="text-red-600 mb-4">
          エラーが発生しました
        </Text>
        <HelperText className="text-center mb-4">{error.message}</HelperText>
        <Button onPress={() => refetch()} title="再試行" />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text variant="headlineSmall" className="mb-4">
          ブックマークがありません
        </Text>
        <Text variant="bodyMedium" className="text-center mb-4 text-slate-600">
          右下のボタンから新しいブックマークを追加できます
        </Text>
        <FAB
          icon="add"
          onPress={handleAdd}
          className="absolute bottom-4 right-4"
        />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={bookmarks.map((bookmark) => getFragmentData(BOOKMARK, bookmark))}
        renderItem={({ item }) => (
          <BookmarkItem
            bookmark={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      />
      <FAB
        icon="add"
        onPress={handleAdd}
        className="absolute bottom-4 right-4"
      />
    </>
  );
};
