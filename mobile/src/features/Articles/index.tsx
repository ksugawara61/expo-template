import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { graphql } from "@/libs/graphql/gql-tada";
import { useQuery } from "@/libs/graphql/urql";

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

export const Articles: FC = () => {
  const LIMIT = 20;
  const [allArticles, setAllArticles] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [{ data, fetching, error }] = useQuery({
    query: GetArticles,
    variables: { offset, limit: LIMIT },
  });

  // Update articles when new data is fetched
  useEffect(() => {
    if (data?.articles) {
      if (offset === 0) {
        // First load
        setAllArticles(data.articles);
      } else {
        // Append new articles
        setAllArticles((prev) => [...prev, ...data.articles]);
      }

      // Check if we have more data
      if (data.articles.length < LIMIT) {
        setHasMoreData(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, offset]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !fetching) {
      setIsLoadingMore(true);
      setOffset((prev) => prev + LIMIT);
    }
  }, [isLoadingMore, hasMoreData, fetching]);

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
    if (!isLoadingMore) return null;
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
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};
