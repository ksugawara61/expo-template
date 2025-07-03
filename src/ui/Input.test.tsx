import { render, screen } from "@testing-library/react-native";
import { Input } from "./Input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input />);
    expect(screen.getByPlaceholderText("useless placeholder")).toBeTruthy();
  });
});
