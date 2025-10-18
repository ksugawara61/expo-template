import "@getcronit/pylon";

declare module "@getcronit/pylon" {
  interface Bindings {
    SECRET_KEY: string;
    TURSO_DATABASE_URL: string;
    TURSO_AUTH_TOKEN: string;
  }

  interface Variables {}
}
