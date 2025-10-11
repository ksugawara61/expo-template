import { composeStories } from "@storybook/react-native-web-vite";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./index.stories";

const { Default } = composeStories(stories);

describe("License", () => {
  it("should be rendered", async () => {
    await render(<Default />);

    expect(screen.getByText("オープンソースライセンス")).toBeOnTheScreen();
  });
});
