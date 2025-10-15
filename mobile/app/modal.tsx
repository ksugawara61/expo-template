import { useLocalSearchParams } from "expo-router";
import type { FragmentOf } from "gql.tada";
import { BookmarkAddEdit } from "@/features/BookmarkAddEdit";
import type { BOOKMARK } from "@/features/Bookmarks";

export default function BookmarkModal() {
  const params = useLocalSearchParams();
  const bookmark = params.bookmark
    ? (JSON.parse(params.bookmark as string) as FragmentOf<typeof BOOKMARK>)
    : undefined;

  return <BookmarkAddEdit bookmark={bookmark} />;
}
