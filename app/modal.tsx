import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import type { Bookmark } from "@/features/Bookmarks";
import { BookmarkForm } from "@/features/Bookmarks";

export default function BookmarkModal() {
  const params = useLocalSearchParams();
  const bookmark = params.bookmark
    ? (JSON.parse(params.bookmark as string) as Bookmark)
    : undefined;

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1">
      <BookmarkForm
        bookmark={bookmark}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </View>
  );
}
