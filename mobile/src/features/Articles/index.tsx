import type { FC } from "react";
import { FlatList, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { graffleClient } from "@/libs/graphql/graffleClient";
import { useSWRSuspense } from "@/libs/swr";

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

export const Articles: FC = () => {
  const { data } = useSWRSuspense(["articles", 1], async () => {
    const result = await graffleClient.gql`
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
      `.send({ page: 1 });
    return result;
  });

  if (!data) {
    throw new Error("Data is null");
  }

  const articles = data.articles;

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
