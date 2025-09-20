import type { Resource } from "i18next";
import { articlesLocales } from "@/features/Articles/locales";
import { bookmarkAddEditLocales } from "@/features/BookmarkAddEdit/locales";

export const resources: Resource = {
  en: {
    ...articlesLocales.en,
    ...bookmarkAddEditLocales.en,
  },
  ja: {
    ...articlesLocales.ja,
    ...bookmarkAddEditLocales.ja,
  },
};
