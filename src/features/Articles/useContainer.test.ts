import { server } from "@/libs/test/server";
import { renderHook } from "@/libs/test/testing-library";
import { handlers } from "./index.mocks";
import { useContainer } from "./useContainer";

describe("useContainer", () => {
  it("should fetch articles", async () => {
    server.use(...handlers.Success);
    const { result } = await renderHook(() => useContainer());

    expect(result.current.data).toBeDefined();
  });
});
