import { server } from "@/libs/test/server";
import { renderHook } from "@/libs/test/testing-library";
import { useContainer } from "./useContainer";
import { handlers } from "./useContainer.mocks";

describe("useContainer", () => {
  it("should fetch articles", () => {
    server.use(...handlers.Success);
    const { result } = renderHook(() => useContainer());

    expect(result.current.data).toBeDefined();
  });
});
