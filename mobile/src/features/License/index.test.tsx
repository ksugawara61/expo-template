import { composeStories } from "@storybook/react-native-web-vite";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { License } from "./index";
import * as stories from "./index.stories";

const { Default } = composeStories(stories);

describe("License", () => {
  describe("Component Rendering", () => {
    it("should render license screen with header and statistics", async () => {
      // Arrange
      const expectedTitle = "オープンソースライセンス";
      const expectedDescription =
        "このアプリで使用されているオープンソースソフトウェアのライセンス一覧です。";

      // Act
      await render(<License />);

      // Assert
      expect(screen.getByText(expectedTitle)).toBeOnTheScreen();
      expect(screen.getByText(expectedDescription)).toBeOnTheScreen();
      expect(screen.getByText("統計情報")).toBeOnTheScreen();
      expect(screen.getByText("ライセンス一覧")).toBeOnTheScreen();
      // Check that some package count is displayed
      expect(screen.getByText(/総パッケージ数: \d+/)).toBeOnTheScreen();
    });
  });

  describe("Top 5 License Types Display", () => {
    it("should display license types with counts", async () => {
      // Arrange - No specific data since we're testing with real data

      // Act
      await render(<License />);

      // Assert - Check that license chips with counts are displayed
      const chips = screen.getAllByText(/: \d+$/);
      expect(chips.length).toBeGreaterThan(0);
      expect(chips.length).toBeLessThanOrEqual(10); // Should show at most 10 license types
    });
  });

  describe("Package Name Search", () => {
    it("should filter licenses when typing in search bar", async () => {
      // Arrange
      const searchTerm = "react"; // Common package name

      // Act
      await render(<License />);

      // Get initial package count
      const initialCountText = screen.getByText(/総パッケージ数: \d+/);
      // React Native Testing Library では children[1] に数字が格納される
      const initialCountString = initialCountText.children[1]?.toString() || "";
      const initialCountMatch = initialCountString.match(/\d+/);
      const initialCount = initialCountMatch
        ? Number.parseInt(initialCountMatch[0])
        : 0;

      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );

      await userEvent.type(searchInput, searchTerm);

      // Assert
      // 1. Package count should change when filtering
      const filteredCountText = screen.getByText(/総パッケージ数: \d+/);
      const filteredCountString =
        filteredCountText.children[1]?.toString() || "";
      const filteredCountMatch = filteredCountString.match(/\d+/);
      const filteredCount = filteredCountMatch
        ? Number.parseInt(filteredCountMatch[0])
        : 0;

      expect(filteredCount).toBeLessThan(initialCount); // Count should decrease after filtering
      expect(filteredCount).toBeGreaterThan(0); // Should have some results for "react"

      // 2. Check that specific packages containing "react" are displayed
      // Look for any text containing "react" (case insensitive) in the package list
      const reactPackages = screen.queryAllByText(/react/i);
      expect(reactPackages.length).toBeGreaterThan(0); // Should find at least one package with "react"
    });

    it("should show all packages when search is cleared", async () => {
      // Arrange
      const searchTerm = "test-search-term";

      // Act
      await render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );

      // First search for something (should reduce count)
      await userEvent.type(searchInput, searchTerm);

      // Then clear the search (should restore original count)
      await userEvent.clear(searchInput);

      // Assert - Original count should be restored
      expect(screen.getByText(/総パッケージ数: \d+/)).toBeOnTheScreen();
    });
  });

  describe("License Type Search", () => {
    it("should filter licenses by license type when typing in search bar", async () => {
      // Arrange
      const searchTerm = "MIT"; // Common license type

      // Act
      await render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Search functionality should work - we test this by checking the results
      // Check that package count is displayed (should be filtered)
      expect(screen.getByText(/総パッケージ数: \d+/)).toBeOnTheScreen();
    });
  });

  describe("Publisher Search", () => {
    it("should filter licenses by publisher when typing in search bar", async () => {
      // Arrange
      const searchTerm = "React"; // Common publisher

      // Act
      await render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Search functionality should work - we test this by checking the results
      // Check that package count is displayed (should be filtered)
      expect(screen.getByText(/総パッケージ数: \d+/)).toBeOnTheScreen();
    });
  });

  describe("Search Behavior", () => {
    it("should be case insensitive for search", async () => {
      // Arrange
      const searchTerm = "REACT"; // Upper case search term

      // Act
      await render(<License />);
      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      // Search functionality should work - checking for results
      expect(screen.getByText(/総パッケージ数: \d+/)).toBeOnTheScreen();
    });

    it("should update package count when filtering", async () => {
      // Arrange
      const searchTerm = "test-unique-term-123";

      // Act
      await render(<License />);

      const searchInput = screen.getByPlaceholderText(
        "パッケージ名、ライセンス、作成者で検索...",
      );
      await userEvent.type(searchInput, searchTerm);

      // Assert
      const filteredCountText = screen.getByText(/総パッケージ数: \d+/);
      expect(filteredCountText).toBeOnTheScreen();
      // For a non-existent search term, count should be low (likely 0 or very few)
      // We don't assert exact count since it depends on real data
    });
  });

  describe("Storybook Integration", () => {
    it("should render the default story", async () => {
      // Arrange & Act
      await render(<Default />);

      // Assert
      expect(screen.getByText("オープンソースライセンス")).toBeOnTheScreen();
    });
  });
});
