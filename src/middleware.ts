import { supabase } from "@/lib/supabase";
import {
  ACCESS_TOKEN_NAME,
  HOME_URL,
  PUBLIC_URLS,
  REFRESH_TOKEN_NAME,
  SIGN_IN_URL,
} from "@/util/constants";
import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import type { ValidationResult } from "./schema/validation-result";
import type { ApiResponse } from "./schema/api-response";
import {
  type NavigationOption,
  navigationOptions,
  rolesName,
} from "./util/role";
import type { QueryData } from "@supabase/supabase-js";

/**
 * Verifies the given access and refresh tokens with Supabase.
 * @param accessToken The access token to verify.
 * @param refreshToken The refresh token to verify.
 * @returns A promise that resolves with a ValidationResult object.
 * The status property of this object may be "authorized", "unauthorized", or "error".
 * The message property is a human-readable message that describes the result of the verification.
 */
async function verifyAuthentication(
  accessToken?: string,
  refreshToken?: string,
): Promise<ValidationResult> {
  if (!accessToken || !refreshToken) {
    return {
      status: "unauthorized",
      message: "Please pass access token and refresh token",
    };
  }
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return { status: "error", message: "Could not verify credentials" };
  }

  return { status: "authorized", message: "Credentials verified" };
}

/**
 * Middleware that verifies authentication for routes that are not in `PUBLIC_URLS`.
 * @param context The Astro context.
 * @param next The next middleware to call.
 * @returns A promise that resolves with the result of calling `next`, or redirects to the sign-in page if the user is not authenticated.
 */
async function authenticate(context: APIContext, next: MiddlewareNext) {
  const { cookies, redirect } = context;

  if (PUBLIC_URLS.includes(context.url.pathname)) {
    return await next();
  }

  const accessToken = cookies.get(ACCESS_TOKEN_NAME)?.value;
  const refreshToken = cookies.get(REFRESH_TOKEN_NAME)?.value;

  const validationResult = await verifyAuthentication(
    accessToken,
    refreshToken,
  );

  switch (validationResult.status) {
    case "error":
      cookies.delete(ACCESS_TOKEN_NAME, { path: "/" });
      cookies.delete(REFRESH_TOKEN_NAME, { path: "/" });

      return redirect(SIGN_IN_URL);

    case "unauthorized":
      if (context.url.pathname.startsWith("/api/")) {
        const response: ApiResponse<null> = {
          message: validationResult.message,
          data: null,
        };
        return new Response(JSON.stringify(response), { status: 401 });
      }
      return redirect(SIGN_IN_URL);

    case "authorized":
      return await next();
    default:
      return redirect(SIGN_IN_URL);
  }
}

/**
 * Middleware that loads the user's role and stores it in the request context.
 * If the user is not authenticated or the role can't be loaded, redirects to the sign-in page.
 * @param context The Astro context.
 * @param next The next middleware to call.
 * @returns A promise that resolves with the result of calling `next`, or redirects to the sign-in page if the user is not authenticated or the role can't be loaded.
 */
async function profile(context: APIContext, next: MiddlewareNext) {
  // If the navigation heads to a public url, the profile retrieving will me omitted
  if (PUBLIC_URLS.includes(context.url.pathname)) {
    return await next();
  }
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return context.redirect(SIGN_IN_URL);
  }

  const workerQuery = supabase
    .from("Trabajador")
    .select(`Rol(id_rol, txt_nombre)`)
    .eq("fk_id_usuario", userId)
    .single();

  const { data, error: workerError } = await workerQuery;

  if (workerError) {
    context.locals.serverError = "Sesion de trabajador invalido";
    return context.redirect(SIGN_IN_URL);
  }
  const workerData: QueryData<typeof workerQuery> = data;

  const role = workerData.Rol;

  if (!role) {
    context.locals.serverError = "Error al obtener el rol de trabajador";
    return context.redirect(SIGN_IN_URL);
  }

  context.locals.role = {
    id: role.id_rol,
    name: rolesName[role.txt_nombre],
  };
  context.locals.navigationOptions = navigationOptions[role.txt_nombre];
  context.locals.welcomeTitle = () => `Bienvenido ${context.locals.role.name}`;

  return await next();
}

/**
 * Middleware that checks if the user can access the current route based on their role.
 * If the user can't access the route, redirects them to the home page.
 * @param context The Astro context.
 * @param next The next middleware to call.
 * @returns A promise that resolves with the result of calling `next`, or redirects to the home page if the user can't access the route.
 */
function accessControl(context: APIContext, next: MiddlewareNext) {
  // At this point, the user is has an active and valid session so, if the user navigates to sign-in, they will be redirected to HOME_URL
  if (context.url.pathname === SIGN_IN_URL) return next();
  if (PUBLIC_URLS.includes(context.url.pathname)) return next();

  // If the user (with active and valid session) navigates to HOME_URL, they will access to it
  if (context.url.pathname === HOME_URL) return next();

  const canAccess = context.locals.navigationOptions
    .map((option: NavigationOption) => option.path)
    .some((path) => context.url.pathname.startsWith(path));

  if (canAccess) return next();

  return context.redirect(HOME_URL);
}

export const onRequest = sequence(authenticate, profile, accessControl);
