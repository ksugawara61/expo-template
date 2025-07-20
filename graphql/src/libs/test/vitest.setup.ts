import { afterAll, afterEach, beforeAll } from "vitest";
import { mockServer } from "./mockServer";

beforeAll(() => {
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
