import type { FC } from "react";
import { FlatList, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { useQuery } from "urql";
import { graphql } from "@/libs/gql";

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
  query GetArticles($page: Number!) {
    articles(page: $page) {
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
  const [result] = useQuery({
    query: GetArticles,
    variables: { page: 1 },
  });

  // With suspense enabled, we don't need to check fetching state
  // Suspense will handle loading states automatically
  if (result.error) throw result.error;
  if (!result.data) return null;

  const { articles } = result.data;

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

  return (
    <FlatList
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={{ height: "100%", width: "100%" }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
    />
  );
};
