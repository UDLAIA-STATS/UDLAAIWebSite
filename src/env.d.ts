interface ImportMetaEnv {
  readonly AUTH_URL: string;
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