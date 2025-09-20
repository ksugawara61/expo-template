import { useMutation } from "@apollo/client";
import { router } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      newErrors.title = t("bookmarkAddEdit.titleRequired");
    }

    if (!url.trim()) {
      newErrors.url = t("bookmarkAddEdit.urlRequired");
    } else {
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        newErrors.url = t("bookmarkAddEdit.urlInvalid");
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

        Alert.alert(
          t("bookmarkAddEdit.success"),
          t("bookmarkAddEdit.bookmarkUpdated"),
        );
      } else {
        const input: CreateBookmarkInput = {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
        };

        await createBookmark({
          variables: { input },
        });

        Alert.alert(
          t("bookmarkAddEdit.success"),
          t("bookmarkAddEdit.bookmarkCreated"),
        );

        // Reset form for new bookmark
        setTitle("");
        setUrl("");
        setDescription("");
      }

      handleSuccess();
    } catch {
      Alert.alert(
        t("bookmarkAddEdit.error"),
        t(
          isEditing
            ? "bookmarkAddEdit.updateFailed"
            : "bookmarkAddEdit.createFailed",
        ),
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
      <Card style={{ margin: 16 }}>
        <Card.Title
          title={t(
            isEditing
              ? "bookmarkAddEdit.editBookmark"
              : "bookmarkAddEdit.newBookmark",
          )}
          titleVariant="headlineSmall"
        />
        <Card.Content>
          <View style={{ gap: 16 }}>
            <View>
              <TextInput
                label={t("bookmarkAddEdit.title")}
                value={title}
                onChangeText={setTitle}
                placeholder={t("bookmarkAddEdit.titlePlaceholder")}
                error={!!errors.title}
              />
              {errors.title && (
                <HelperText type="error">{errors.title}</HelperText>
              )}
            </View>

            <View>
              <TextInput
                label={t("bookmarkAddEdit.url")}
                value={url}
                onChangeText={setUrl}
                placeholder={t("bookmarkAddEdit.urlPlaceholder")}
                error={!!errors.url}
              />
              {errors.url && <HelperText type="error">{errors.url}</HelperText>}
            </View>

            <View>
              <TextInput
                label={t("bookmarkAddEdit.description")}
                value={description}
                onChangeText={setDescription}
                placeholder={t("bookmarkAddEdit.descriptionPlaceholder")}
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
                {t("bookmarkAddEdit.cancel")}
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading
                  ? t("bookmarkAddEdit.processing")
                  : t(
                      isEditing
                        ? "bookmarkAddEdit.update"
                        : "bookmarkAddEdit.create",
                    )}
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
