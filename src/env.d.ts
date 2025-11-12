interface ImportMetaEnv {
  readonly AUTH_URL: string;
  readonly TEAMSERVICE_URL: string;
  readonly JUGADORES_API: string;
  readonly KAFKA_SERVICE: string;

  readonly FIREBASE_PRIVATE_KEY_ID: string;
  readonly FIREBASE_STORAGE_BUCKET: string;
  readonly FIREBASE_MESSAGING_SENDER_ID: string;
  readonly FIREBASE_APP_ID: string;
  readonly FIREBASE_AUTH_DOMAIN: string;
  readonly FIREBASE_MEASUREMENT_ID: string;
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_CLIENT_ID: string;
  readonly FIREBASE_AUTH_URI: string;
  readonly FIREBASE_TOKEN_URI: string;
  readonly FIREBASE_AUTH_CERT_URL: string;
  readonly FIREBASE_CLIENT_CERT_URL: string;
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