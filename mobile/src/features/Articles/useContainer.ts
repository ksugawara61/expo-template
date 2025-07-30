import { useSuspenseQuery } from "@apollo/client";
import { graphql } from "@/libs/gql";

export const GetArticles = graphql(`
  query GetArticles($page: Number!) {
    articles(page: $page) {
      id
      title
      user {
        name
      }
      created_at
      tags {
        name
      }
    }
  }
`);

export const useContainer = () => {
  const {
    data: { articles },
  } = useSuspenseQuery(GetArticles, {
    variables: { page: 1 },
  });

  return { data: articles };
};
