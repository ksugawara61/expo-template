import createFetch from "openapi-fetch";

export const createQiitaApiClient = createFetch({
  baseUrl: "https://qiita.com/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});
