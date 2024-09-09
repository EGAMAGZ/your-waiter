import { supabase } from "@/lib/supabase";
import { ACCESS_TOKEN_NAME, PUBLIC_URLS, REFRESH_TOKEN_NAME, SIGN_IN_URL } from "@/util/constants";
import type { APIContext, MiddlewareNext } from "astro";
import { defineMiddleware, sequence } from "astro:middleware";

async function authenticate(context: APIContext, next: MiddlewareNext) {
    const { cookies, redirect } = context;

    const accessToken = cookies.get(ACCESS_TOKEN_NAME)?.value;
    const refreshToken = cookies.get(REFRESH_TOKEN_NAME)?.value;

    if (PUBLIC_URLS.includes(context.url.pathname)) {
        return await next()
    }

    if (!accessToken || !refreshToken) {
        return redirect(SIGN_IN_URL);
    }

    const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

    if (error) {

        cookies.delete(ACCESS_TOKEN_NAME, { path: '/' })
        cookies.delete(REFRESH_TOKEN_NAME, { path: '/' })

        return redirect(SIGN_IN_URL);
    }

    return await next()
}

async function profile(context: APIContext, next: MiddlewareNext) {

}


export const onRequest = sequence(authenticate)