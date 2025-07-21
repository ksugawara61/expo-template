import { useMutation, useQuery } from "@apollo/client";
import { router } from "expo-router";
import type { FC } from "react";
import { Alert, ScrollView, View } from "react-native";

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

import { DELETE_BOOKMARK, GET_BOOKMARKS } from "./queries";
import type { Bookmark } from "./types";

type BookmarkItemProps = {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
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
        <Text variant="bodyMedium" className="text-blue-600 mb-4">
          {bookmark.url}
        </Text>
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

export const BookmarkList: FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_BOOKMARKS);
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

  const handleEdit = (bookmark: Bookmark) => {
    router.push({
      pathname: "/modal" as any,
      params: { bookmark: JSON.stringify(bookmark) },
    });
  };

  const handleAdd = () => {
    router.push("/modal" as any);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" className="mt-4">
          ブックマークを読み込み中...
        </Text>
      </View>
    );
  }

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

  const bookmarks = data?.bookmarks || [];

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
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {bookmarks.map((bookmark: Bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ScrollView>
      <FAB
        icon="add"
        onPress={handleAdd}
        className="absolute bottom-4 right-4"
      />
    </View>
  );
};
