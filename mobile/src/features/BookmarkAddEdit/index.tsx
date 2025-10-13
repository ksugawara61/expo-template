import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { graphql } from "@/libs/graphql/graphql";
import { useMutation } from "@/libs/graphql/urql";
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
      tags {
        id
        name
      }
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
      tags {
        id
        name
      }
      title
      updated_at
      url
    }
  }
`);

type BookmarkData = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  tags: Array<{ id: string; name: string }> | null;
};

type Props = {
  bookmark?: BookmarkData | null;
};

export const BookmarkAddEdit: FC<Props> = ({ bookmark }) => {
  const isEditing = !!bookmark;
  const bookmarkData = bookmark || null;

  const schema = isEditing ? updateBookmarkSchema : createBookmarkSchema;

  const [tags, setTags] = useState<string[]>(() => {
    if (!bookmarkData?.tags) return [];
    return bookmarkData.tags.map((tag: { name: string }) => tag.name);
  });
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBookmarkInput | UpdateBookmarkInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: bookmarkData?.title ?? "",
      url: bookmarkData?.url ?? "",
      description: bookmarkData?.description ?? "",
      tagNames:
        bookmarkData?.tags?.map((tag: { name: string }) => tag.name) ?? [],
    },
  });

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const [, updateBookmark] = useMutation(UPDATE_BOOKMARK);
  const [, createBookmark] = useMutation(CREATE_BOOKMARK);
  const onSubmit = async (data: CreateBookmarkInput | UpdateBookmarkInput) => {
    try {
      if (isEditing && bookmarkData) {
        const input: UpdateBookmarkInput = {
          title: data.title?.trim(),
          url: data.url?.trim(),
          description: data.description?.trim() || undefined,
          tagNames: tags,
        };

        if (!bookmarkData?.id) return;
        await updateBookmark({ id: bookmarkData.id, input });

        Alert.alert("成功", "ブックマークを更新しました");
      } else {
        const input: CreateBookmarkInput = {
          title: data.title as string,
          url: data.url as string,
          description: data.description?.trim() || undefined,
          tagNames: tags,
        };

        await createBookmark({ input });

        Alert.alert("成功", "ブックマークを作成しました");
        reset();
        setTags([]);
      }

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

            <View>
              <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                タグ
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                <TextInput
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="タグ名を入力"
                  style={{ flex: 1 }}
                  onSubmitEditing={addTag}
                />
                <Button
                  mode="outlined"
                  onPress={addTag}
                  disabled={!tagInput.trim()}
                >
                  追加
                </Button>
              </View>
              {tags.length > 0 && (
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
                >
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => removeTag(tag)}
                      closeIcon="close"
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
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
