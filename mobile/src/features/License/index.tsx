import type { FC } from "react";
import { useMemo, useState } from "react";
import { FlatList, Linking, View } from "react-native";
import {
  Card,
  Chip,
  Searchbar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import licensesData from "@/data/licenses.json";
import type { LicenseInfo } from "./types";

export const License: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const licenses: LicenseInfo[] = licensesData;

  const filteredLicenses = useMemo(() => {
    if (!searchQuery) return licenses;

    const query = searchQuery.toLowerCase();
    return licenses.filter(
      (license) =>
        license.name.toLowerCase().includes(query) ||
        (typeof license.license === "string"
          ? license.license.toLowerCase().includes(query)
          : license.license.some((l) => l.toLowerCase().includes(query))) ||
        license.publisher?.toLowerCase().includes(query),
    );
  }, [licenses, searchQuery]);

  const handlePress = (license: LicenseInfo) => {
    if (license.repository) {
      void Linking.openURL(license.repository);
    } else if (license.url) {
      void Linking.openURL(license.url);
    }
  };

  const renderLicenseItem = ({ item }: { item: LicenseInfo }) => (
    <Card style={{ marginBottom: 8 }}>
      <TouchableRipple
        onPress={() => handlePress(item)}
        disabled={!item.repository && !item.url}
      >
        <Card.Content style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                v{item.version}
              </Text>
            </View>
            <Chip
              mode="outlined"
              compact
              style={{ backgroundColor: "transparent" }}
            >
              {Array.isArray(item.license)
                ? item.license.join(", ")
                : item.license}
            </Chip>
          </View>

          {item.publisher && (
            <Text variant="bodySmall" style={{ opacity: 0.8, marginBottom: 4 }}>
              Publisher: {item.publisher}
              {item.email && ` (${item.email})`}
            </Text>
          )}

          {(item.repository || item.url) && (
            <Text variant="bodySmall" style={{ opacity: 0.6 }}>
              {item.repository || item.url}
            </Text>
          )}
        </Card.Content>
      </TouchableRipple>
    </Card>
  );

  const groupedByLicense = useMemo(() => {
    const groups: { [key: string]: number } = {};
    filteredLicenses.forEach((license) => {
      const licenseType = Array.isArray(license.license)
        ? license.license.join(", ")
        : license.license;
      groups[licenseType] = (groups[licenseType] || 0) + 1;
    });
    return groups;
  }, [filteredLicenses]);

  const renderHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
        オープンソースライセンス
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 16, opacity: 0.7 }}>
        このアプリで使用されているオープンソースソフトウェアのライセンス一覧です。
      </Text>

      <Searchbar
        placeholder="パッケージ名、ライセンス、作成者で検索..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 16 }}
      />

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        統計情報
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
        総パッケージ数: {filteredLicenses.length}
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {Object.entries(groupedByLicense)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([license, count]) => (
            <Chip key={license} compact>
              <Text>
                {license}: {count}
              </Text>
            </Chip>
          ))}
      </View>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        ライセンス一覧
      </Text>
    </View>
  );

  return (
    <FlatList
      data={filteredLicenses}
      renderItem={renderLicenseItem}
      keyExtractor={(item) => `${item.name}@${item.version}`}
      ListHeaderComponent={renderHeader}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
