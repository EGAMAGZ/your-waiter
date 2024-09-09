import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME, SIGN_IN_URL } from "@/util/constants";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
    cookies.delete(ACCESS_TOKEN_NAME, { path: '/' })
    cookies.delete(REFRESH_TOKEN_NAME, { path: '/' })

    return redirect(SIGN_IN_URL)
}