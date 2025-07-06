import { createQiitaApiClient } from "@/libs/openapi/client";
import { useSWRSuspense } from "@/libs/swr";

export const useContainer = () => {
  const { data } = useSWRSuspense("/items", async () => {
    const response = await createQiitaApiClient().GET("/items", {});
    return response.data;
  });

  return { data };
};
