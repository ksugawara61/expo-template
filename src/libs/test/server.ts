import { setupServer } from "msw/node";
import { createOpenApiHttp } from "openapi-msw";
import { baseUrl } from "../openapi/client";
import type { paths } from "../openapi/schemas/qiita";

export const openApiMockClient = createOpenApiHttp<paths>({ baseUrl });

export const server = setupServer();
