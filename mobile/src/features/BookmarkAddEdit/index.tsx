import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import { graphql } from "@/libs/gql";
import { graphqlMutate } from "@/libs/graphql/fetcher";
import { useSWRConfig } from "@/libs/swr";
import type { BookmarkFragment } from "../Bookmarks/index.msw";
import {
  type CreateBookmarkInput,
  createBookmarkSchema,
  type UpdateBookmarkInput,
  updateBookmarkSchema,
} from "../Bookmarks/types";

const CREATE_BOOKMARK = graphql(`
  mutation CreateBookmark($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
      created_at
      description
      id
      title
      updated_at
      url
    }
  }
`);

const UPDATE_BOOKMARK = graphql(`
  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {
    updateBookmark(id: $id, input: $input) {
      created_at
      description
      id
      title
      updated_at
      url
    }
  }
`);

type Props = {
  bookmark?: BookmarkFragment;
};

export const BookmarkAddEdit: FC<Props> = ({ bookmark }) => {
  const isEditing = !!bookmark;
  const { mutate } = useSWRConfig();

  const schema = isEditing ? updateBookmarkSchema : createBookmarkSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBookmarkInput | UpdateBookmarkInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: bookmark?.title || "",
      url: bookmark?.url || "",
      description: bookmark?.description || "",
    },
  });

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const onSubmit = async (data: CreateBookmarkInput | UpdateBookmarkInput) => {
    try {
      if (isEditing && bookmark) {
        const input: UpdateBookmarkInput = {
          title: data.title?.trim(),
          url: data.url?.trim(),
          description: data.description?.trim() || undefined,
        };

        await graphqlMutate(UPDATE_BOOKMARK, { id: bookmark.id, input });

        Alert.alert("成功", "ブックマークを更新しました");
      } else {
        const input: CreateBookmarkInput = {
          title: data.title as string,
          url: data.url as string,
          description: data.description?.trim() || undefined,
        };

        await graphqlMutate(CREATE_BOOKMARK, { input });

        Alert.alert("成功", "ブックマークを作成しました");
        reset();
      }

      // キャッシュを無効化して再取得
      await mutate("GetBookmarks");
      handleSuccess();
    } catch {
      Alert.alert(
        "エラー",
        `ブックマークの${isEditing ? "更新" : "作成"}に失敗しました`,
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
      <Card style={{ margin: 16 }}>
        <Card.Title
          title={isEditing ? "ブックマークを編集" : "新しいブックマーク"}
          titleVariant="headlineSmall"
        />
        <Card.Content>
          <View style={{ gap: 16 }}>
            <View>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="タイトル"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="ブックマークのタイトルを入力"
                    error={!!errors.title}
                  />
                )}
              />
              {errors.title && (
                <HelperText type="error">{errors.title.message}</HelperText>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="url"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="URL"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="https://example.com"
                    error={!!errors.url}
                  />
                )}
              />
              {errors.url && (
                <HelperText type="error">{errors.url.message}</HelperText>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="説明（任意）"
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="ブックマークの説明を入力"
                    multiline
                    numberOfLines={3}
                    error={!!errors.description}
                  />
                )}
              />
              {errors.description && (
                <HelperText type="error">
                  {errors.description.message}
                </HelperText>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                キャンセル
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? "処理中..." : isEditing ? "更新" : "作成"}
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
