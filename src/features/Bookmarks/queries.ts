import { gql } from "@apollo/client";

export const GET_BOOKMARK = gql`
  query GetBookmark($id: String!) {
    bookmark(id: $id) {
      id
      title
      url
      description
      created_at
      updated_at
    }
  }
`;

export const CREATE_BOOKMARK = gql`
  mutation CreateBookmark($input: InputInput!) {
    createBookmark(input: $input) {
      id
      title
      url
      description
      created_at
      updated_at
    }
  }
`;

export const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($id: String!, $input: InputInput_1!) {
    updateBookmark(id: $id, input: $input) {
      id
      title
      url
      description
      created_at
      updated_at
    }
  }
`;
