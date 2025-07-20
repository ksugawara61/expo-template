import { server } from "@/libs/test/server";
import { renderHook } from "@/libs/test/testing-library";
import { useContainer } from "./useContainer";
import { handlers } from "./useContainer.mocks";

describe("useContainer", () => {
  it("should fetch articles", async () => {
    server.use(...handlers.Success);
    const { result } = await renderHook(() => useContainer());

    expect(result.current.data).toBeDefined();
  });
});
