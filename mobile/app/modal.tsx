import { useLocalSearchParams } from "expo-router";
import { BookmarkAddEdit } from "@/features/BookmarkAddEdit";
import type { BOOKMARK } from "@/features/Bookmarks";
import type { FragmentOf } from "@/libs/graphql/gql-tada";

export default function BookmarkModal() {
  const params = useLocalSearchParams();
  const bookmark = params.bookmark
    ? (JSON.parse(params.bookmark as string) as FragmentOf<typeof BOOKMARK>)
    : undefined;

  return <BookmarkAddEdit bookmark={bookmark} />;
}
