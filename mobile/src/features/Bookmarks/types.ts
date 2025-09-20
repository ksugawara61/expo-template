import { z } from "zod";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export const createBookmarkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  url: z
    .string()
    .trim()
    .min(1, "URLは必須です")
    .url("有効なURLを入力してください"),
  description: z
    .string()
    .trim()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
});

export const updateBookmarkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください")
    .optional(),
  url: z
    .string()
    .trim()
    .min(1, "URLは必須です")
    .url("有効なURLを入力してください")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
