import { useLocalSearchParams } from "expo-router";
import { BookmarkAddEdit } from "@/features/BookmarkAddEdit";
import type { BookmarkFragment } from "@/features/Bookmarks/index.msw";

export default function BookmarkModal() {
  const params = useLocalSearchParams();
  const bookmark = params.bookmark
    ? (JSON.parse(params.bookmark as string) as BookmarkFragment)
    : undefined;

  return <BookmarkAddEdit bookmark={bookmark} />;
}
