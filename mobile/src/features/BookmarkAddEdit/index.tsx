import { useMutation } from "@apollo/client";
import { router } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import { graphql } from "@/libs/gql";
import { GET_BOOKMARKS } from "../Bookmarks";
import type { BookmarkFragment } from "../Bookmarks/index.msw";
import type {
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../Bookmarks/types";

const CREATE_BOOKMARK = graphql(`
  mutation CreateBookmark($input: InputInput!) {
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
  mutation UpdateBookmark($id: String!, $input: InputInput_1!) {
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

  const [title, setTitle] = useState(bookmark?.title || "");
  const [url, setUrl] = useState(bookmark?.url || "");
  const [description, setDescription] = useState(bookmark?.description || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createBookmark, { loading: createLoading }] = useMutation(
    CREATE_BOOKMARK,
    {
      refetchQueries: [{ query: GET_BOOKMARKS }],
    },
  );

  const [updateBookmark, { loading: updateLoading }] = useMutation(
    UPDATE_BOOKMARK,
    {
      refetchQueries: [{ query: GET_BOOKMARKS }],
    },
  );

  const loading = createLoading || updateLoading;

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "タイトルは必須です";
    }

    if (!url.trim()) {
      newErrors.url = "URLは必須です";
    } else {
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        newErrors.url = "有効なURLを入力してください";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && bookmark) {
        const input: UpdateBookmarkInput = {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
        };

        await updateBookmark({
          variables: { id: bookmark.id, input },
        });

        Alert.alert("成功", "ブックマークを更新しました");
      } else {
        const input: CreateBookmarkInput = {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
        };

        await createBookmark({
          variables: { input },
        });

        Alert.alert("成功", "ブックマークを作成しました");

        // Reset form for new bookmark
        setTitle("");
        setUrl("");
        setDescription("");
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
              <TextInput
                label="タイトル"
                value={title}
                onChangeText={setTitle}
                placeholder="ブックマークのタイトルを入力"
                error={!!errors.title}
              />
              {errors.title && (
                <HelperText type="error">{errors.title}</HelperText>
              )}
            </View>

            <View>
              <TextInput
                label="URL"
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                error={!!errors.url}
              />
              {errors.url && <HelperText type="error">{errors.url}</HelperText>}
            </View>

            <View>
              <TextInput
                label="説明（任意）"
                value={description}
                onChangeText={setDescription}
                placeholder="ブックマークの説明を入力"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                disabled={loading}
                style={{ flex: 1 }}
              >
                キャンセル
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "処理中..." : isEditing ? "更新" : "作成"}
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
