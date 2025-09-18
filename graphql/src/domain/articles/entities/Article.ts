export interface Tag {
  name: string;
}

export interface User {
  name: string | null;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  url: string;
  user: User;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}
