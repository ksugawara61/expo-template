import { afterAll, afterEach, beforeAll } from "vitest";
import { mockServer } from "./mockServer";

beforeAll(async () => {
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
