import { defineMiddleware } from "astro:middleware";
import { privateRoutesMap } from "@consts/routes";
import { roles } from "@consts/roles";

export const onRequest = defineMiddleware(
  async ({ url, locals, cookies, redirect }, next) => {
    const user = cookies.get("user")?.value ?? "";

    const rol = locals.user?.rol ?? "";

    if (!user && url.pathname in privateRoutesMap) {
      return redirect("/");
    }

    if (user && url.pathname in privateRoutesMap && rol !== roles.super) {
      return redirect("/");
    }

    if (
      user &&
      url.pathname in privateRoutesMap &&
      rol !== roles.super &&
      rol !== roles.profesor
    ) {
      return redirect("/");
    }

    return next();
  },
);
