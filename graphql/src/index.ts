import { app } from "@getcronit/pylon";
import { serve } from "@hono/node-server";

export { graphql } from "./graphql";

serve(app, (info) => {
  console.log(`Server running at ${info.port}`);
});
