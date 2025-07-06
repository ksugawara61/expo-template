import type { FC } from "react";
import { FlatList, Text, View } from "react-native";
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
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-bold text-gray-900 mb-2">{item.title}</Text>
      <Text className="text-sm text-gray-600 mb-2">by {item.user.name}</Text>
      <View className="flex-row flex-wrap mb-2">
        {item.tags.map((tag) => (
          <Text
            key={tag.name}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
          >
            {tag.name}
          </Text>
        ))}
      </View>
      <Text className="text-xs text-gray-500">
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
