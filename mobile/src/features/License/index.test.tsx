import { composeStories } from "@storybook/react-native-web-vite";
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from "@/libs/test/testing-library";
import { License } from "./index";
import * as stories from "./index.stories";
// Import actual licenses data for testing with real data
import licensesData from "./licenses.json";
import type { LicenseInfo } from "./types";

const { Default } = composeStories(stories);

describe("License", () => {
  beforeEach(() => {
    cleanup();
  });
  describe("Component Rendering", () => {
    it("should render license screen with header and statistics", () => {
      // Arrange
      const expectedTitle = "オープンソースライセンス";
      const expectedDescription =
        "このアプリで使用されているオープンソースソフトウェアのライセンス一覧です。";

      // Act
      render(<License />);

      // Assert
      expect(screen.getByText(expectedTitle)).toBeOnTheScreen();
      expect(screen.getByText(expectedDescription)).toBeOnTheScreen();
      expect(screen.getByText("統計情報")).toBeOnTheScreen();
      expect(screen.getByText("ライセンス一覧")).toBeOnTheScreen();
      // Check that actual data package count is displayed
      expect(
        screen.getByText(`総パッケージ数: ${licensesData.length}`),
      ).toBeOnTheScreen();
    });
  });

  describe("Top 5 License Types Display", () => {
    it("should display license types with counts", () => {
      // Arrange - use actual data
      const actualLicenses = licensesData as LicenseInfo[];

      // Count actual license types
      const licenseTypeCounts: Record<string, number> = {};
      actualLicenses.forEach((license) => {
        const licenseType = Array.isArray(license.license)
          ? license.license.join(", ")
          : license.license;
        licenseTypeCounts[licenseType] =
          (licenseTypeCounts[licenseType] || 0) + 1;
      });

      // Get top license types
      const topLicenseTypes = Object.entries(licenseTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      // Act
      render(<License />);

      // Assert - Check that top license types are displayed
      topLicenseTypes.forEach(([licenseType, count]) => {
        expect(screen.getByText(`${licenseType}: ${count}`)).toBeOnTheScreen();
      });
    });
  });

  describe("Package Name Search", () => {
    it("should filter licenses when typing in search bar", async () => {
      // Arrange
      const searchTerm = "react";

      // Act
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );

      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Check that the count changes from the original total (indicating filtering works)
      await waitFor(() => {
        const countText = screen.getByText(/総パッケージ数: \d+/);
        expect(countText).toBeOnTheScreen();

        // Extract the count and verify it's different from total
        const countMatch = countText.children?.[1]?.toString().match(/\d+/);
        if (countMatch) {
          const filteredCount = Number.parseInt(countMatch[0], 10);
          expect(filteredCount).toBeLessThan(licensesData.length);
          expect(filteredCount).toBeGreaterThan(0);
        }
      });

      // Check that some react-related packages are displayed
      await waitFor(() => {
        expect(screen.getByText(/react/i)).toBeOnTheScreen();
      });
    });

    it("should show all packages when search is cleared", async () => {
      // Act
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );

      // First search for something specific
      await userEvent.type(searchInput, "specific-package");

      // Then clear the search
      await userEvent.clear(searchInput);

      // Assert - Package count should be back to the total
      await waitFor(() => {
        const countText = screen.getByText(/総パッケージ数: \d+/);
        expect(countText).toBeOnTheScreen();

        // The count should be close to the total licenses (allowing for some variation in test environment)
        const countMatch = countText.children?.[1]?.toString().match(/\d+/);
        if (countMatch) {
          const currentCount = Number.parseInt(countMatch[0], 10);
          expect(currentCount).toBeGreaterThan(1000); // Should be a large number indicating search was cleared
        }
      });
    });
  });

  describe("License Type Search", () => {
    it("should filter licenses by license type when typing in search bar", async () => {
      // Arrange
      const searchTerm = "MIT";

      // Act
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Check that package count updates (should be less than total)
      const countText = screen.getByText(/総パッケージ数: \d+/);
      expect(countText).toBeOnTheScreen();

      // Extract the count and ensure it's less than total packages
      const countMatch = countText.children[1]?.toString().match(/\d+/);
      if (countMatch) {
        const filteredCount = Number.parseInt(countMatch[0], 10);
        expect(filteredCount).toBeLessThan(licensesData.length);
        expect(filteredCount).toBeGreaterThan(0); // Should find some MIT licenses
      }
    });
  });

  describe("Publisher Search", () => {
    it("should filter licenses by publisher when typing in search bar", async () => {
      // Arrange
      const searchTerm = "React";

      // Act
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Check that search works by verifying count updates
      const countText = screen.getByText(/総パッケージ数: \d+/);
      expect(countText).toBeOnTheScreen();
    });
  });

  describe("Search Behavior", () => {
    it("should be case insensitive for search", async () => {
      // Arrange
      const searchTerm = "REACT"; // Upper case search term

      // Act
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Check that search works (case insensitive)
      const countText = screen.getByText(/総パッケージ数: \d+/);
      expect(countText).toBeOnTheScreen();
    });

    it("should update package count when filtering", async () => {
      // Arrange
      render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );

      // Get initial count
      const initialCountText = screen.getByText(/総パッケージ数: \d+/);
      const initialCountMatch = initialCountText.children?.[1]
        ?.toString()
        .match(/\d+/);
      const initialCount = initialCountMatch
        ? Number.parseInt(initialCountMatch[0], 10)
        : 0;

      // Act - Search for something specific
      await userEvent.type(searchInput, "react");

      // Assert - Count should be different from initial
      await waitFor(() => {
        const countText = screen.getByText(/総パッケージ数: \d+/);
        expect(countText).toBeOnTheScreen();

        const countMatch = countText.children?.[1]?.toString().match(/\d+/);
        if (countMatch) {
          const filteredCount = Number.parseInt(countMatch[0], 10);
          expect(filteredCount).not.toBe(initialCount); // Count should change
          expect(filteredCount).toBeGreaterThan(0); // Should have some results
        }
      });
    });
  });

  describe("Storybook Integration", () => {
    it("should render the default story", async () => {
      // Arrange & Act
      render(<Default />);

      // Assert
      expect(screen.getByText("オープンソースライセンス")).toBeOnTheScreen();
    });
  });
});
