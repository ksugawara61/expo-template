import { app } from "@getcronit/pylon";
import { serve } from "@hono/node-server";

import { server } from "./server";

export const graphql = server;

serve(app, (info) => {
  console.log(`Server running at ${info.port}`);
});
