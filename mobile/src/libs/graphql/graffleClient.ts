import { Graffle } from "graffle";

export const graffleClient = Graffle.create()
  .transport({ url: "http://127.0.0.1:3000/graphql" })
  .transport({
    headers: {
      "Content-Type": "application/json",
    },
  });

export type GraffleClient = typeof graffleClient;
