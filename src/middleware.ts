import { supabase } from "@/lib/supabase";
import { ACCESS_TOKEN_NAME, PUBLIC_URLS, REFRESH_TOKEN_NAME, SIGN_IN_URL } from "@/util/constants";
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
async function verifyAuthentication(accessToken?: string, refreshToken?: string): Promise<ValidationResult> {
    if (!accessToken || !refreshToken) {
        return { status: "unauthorized", message: "Please pass access token and refresh token" }
    }
    const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

    if (error) {
        return { status: "error", message: "Could not verify credentials" }
    }

    return { status: "authorized", message: "Credentials verified" }
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
        return await next()
    }

    const accessToken = cookies.get(ACCESS_TOKEN_NAME)?.value;
    const refreshToken = cookies.get(REFRESH_TOKEN_NAME)?.value;

    const validationResult = await verifyAuthentication(accessToken, refreshToken);

    switch (validationResult.status) {
        case "error":
            cookies.delete(ACCESS_TOKEN_NAME, { path: '/' })
            cookies.delete(REFRESH_TOKEN_NAME, { path: '/' })

            return redirect(SIGN_IN_URL)

        case "unauthorized":
            if (context.url.pathname.startsWith("/api/")) {
                const response: ApiResponse<null> = {
                    message: validationResult.message,
                    data: null
                }
                return new Response(JSON.stringify(response), { status: 401 })
            }
            return redirect(SIGN_IN_URL)

        case "authorized":
            return await next()
        default:
            return redirect(SIGN_IN_URL)
    }

}

async function handleExceptions(context: APIContext, next: MiddlewareNext){

}

async function profile(context: APIContext, next: MiddlewareNext) {
    context.locals.user = {
        role: "cocina"
    }

    context.locals.welcomeTitle = () => `Bienvenido ${context.locals.user.role}`

    return await next();
}


export const onRequest = sequence(authenticate, profile)
