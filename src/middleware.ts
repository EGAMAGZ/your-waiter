import { supabase } from "@/lib/supabase";
import {
  ACCESS_TOKEN_NAME,
  PUBLIC_URLS,
  REFRESH_TOKEN_NAME,
  SIGN_IN_URL,
} from "@/util/constants";
import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import type { ValidationResult } from "./schema/validation-result";
import type { ApiResponse } from "./schema/api-response";

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
 * Middleware that retrieves the user's role and stores it in the context,
 * as well as generating a welcome title.
 *
 * @param context The Astro context.
 * @param next The next middleware to call.
 * @returns A promise that resolves with the result of calling `next`, or redirects to the sign-in page if the user is not authenticated.
 */
async function profile(context: APIContext, next: MiddlewareNext) {
  if (PUBLIC_URLS.includes(context.url.pathname)) {
    return await next();
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    console.error("No user Id");
    return context.redirect(SIGN_IN_URL);
  }

  const workerQuery = supabase
    .from("Worker")
    .select(`Role(id_role, txt_name)`)
    .eq("id_user", userId)
    .single();

  const { data: workerData, error: workerError } = await workerQuery;

  if (workerError) {
    console.error(workerError);
    return context.redirect(SIGN_IN_URL);
  }

  const role = workerData.Role;

  if (!role) {
    console.error("No role");
    return context.redirect(SIGN_IN_URL);
  }

  context.locals.welcomeTitle = () => `Bienvenido`;

  return await next();
}

export const onRequest = sequence(authenticate, profile);
