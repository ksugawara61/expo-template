import type { FC } from "react";
import { FlatList, View } from "react-native";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Text,
} from "@/components";
import { createQiitaApiClient } from "@/libs/openapi/client";
import { useSWRSuspense } from "@/libs/swr";

type Item = {
  id: string;
  title: string;
  user: {
    id: string;
    name: string | null;
  };
  created_at: string;
  tags: Array<{
    name: string;
  }>;
};

export const Articles: FC = () => {
  const { data } = useSWRSuspense("/items", async () => {
    const response = await createQiitaApiClient().GET("/items", {});
    return response.data;
  });

  const renderItem = ({ item }: { item: Item }) => (
    <Card className="mx-4 my-2">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <Text variant="bodySmall" className="text-slate-600">
          by {item.user.name}
        </Text>
      </CardHeader>
      <CardContent>
        <View className="flex-row flex-wrap mb-2">
          {item.tags.map((tag) => (
            <Badge key={tag.name} variant="secondary" className="mr-2 mb-1">
              {tag.name}
            </Badge>
          ))}
        </View>
        <Text variant="bodySmall" className="text-slate-500">
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </CardContent>
    </Card>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
