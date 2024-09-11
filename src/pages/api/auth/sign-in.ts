import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { ACCESS_TOKEN_NAME, HOME_URL, REFRESH_TOKEN_NAME } from "@/util/constants";
import type { ApiResponse } from "@/schema/api-response";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    const response: ApiResponse = {
      message: "Correo electrónico y contraseña obligatorios",
      error: "Validation error",
      data: null,
    };
    return new Response(JSON.stringify(response), { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;
  cookies.set(ACCESS_TOKEN_NAME, access_token, {
    path: "/",
  });
  cookies.set(REFRESH_TOKEN_NAME, refresh_token, {
    path: "/",
  });

 return redirect(HOME_URL);
};
