import { useLocalSearchParams } from "expo-router";
import { BookmarkAddEdit } from "@/features/BookmarkAddEdit";

type BookmarkData = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  tags: Array<{ id: string; name: string }> | null;
};

export default function BookmarkModal() {
  const params = useLocalSearchParams();
  const bookmarkData = params.bookmark
    ? (JSON.parse(params.bookmark as string) as BookmarkData)
    : undefined;

  return <BookmarkAddEdit bookmark={bookmarkData} />;
}
