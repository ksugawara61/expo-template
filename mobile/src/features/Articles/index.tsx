import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { graphql } from "@/libs/graphql/gql-tada";
import { useLazyQuery } from "@/libs/graphql/urql";

type Item = {
  id: string;
  title: string;
  user: {
    name?: string | null;
  };
  created_at: string;
  tags: Array<{
    name: string;
  }>;
};

export const GetArticles = graphql(`
  query GetArticles($offset: Number, $limit: Number) {
    articles(offset: $offset, limit: $limit) {
      __typename
      created_at
      id
      tags {
        name
      }
      title
      user {
        name
      }
    }
  }
`);

const LIMIT = 20;

export const Articles: FC = () => {
  const [allArticles, setAllArticles] = useState<Item[]>([]);

  const [{ error, fetching }, executeQuery] = useLazyQuery(GetArticles);
  const isAllFetchedRef = useRef(false);
  const handleLoadMore = useCallback(async () => {
    if (isAllFetchedRef.current || fetching) return;

    const { data } = await executeQuery({
      offset: allArticles.length,
      limit: LIMIT,
    });
    if (!data?.articles) {
      isAllFetchedRef.current = true;
      return;
    }
    isAllFetchedRef.current = data.articles.length < LIMIT;
    setAllArticles((prev) => [...prev, ...data.articles]);
  }, [allArticles.length, executeQuery, fetching]);

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={{ padding: 8 }}>
      <Card.Title title={item.title} subtitle={`by ${item.user.name}`} />
      <Card.Content>
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
        >
          {item.tags.map((tag) => (
            <Chip key={tag.name} style={{ marginRight: 8, marginBottom: 4 }}>
              {tag.name}
            </Chip>
          ))}
        </View>
        <Text variant="bodySmall">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderFooter = () => {
    if (!fetching) return null;
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading articles: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allArticles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={{ height: "100%", width: "100%" }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};
