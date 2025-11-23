interface ImportMetaEnv {
  readonly AUTH_URL: string;
  readonly TEAMSERVICE_URL: string;
  readonly JUGADORES_API: string;
  readonly KAFKA_SERVICE: string;
  readonly R2_ACCESS_TOKEN: string;
  readonly R2_ACCESS_KEY_ID: string;
  readonly R2_SECRET_ACCESS_KEY: string;
  readonly S3_CLIENT_ACCOUNT_ENDPOINT: string;
  readonly R2_ACCOUNT_ID: string;
  readonly R2_BUCKET: string;
  readonly CATALOG_URI: string;
  readonly WAREHOUSE: string;
  readonly R2_AUTH_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type LoggedUser = {
    nickname: string,
    email: string,
    rol: string,
    loginTime: Date
}

declare namespace App {
  interface Locals {
    token: string | null;
    user: LoggedUser | null;
  }
}