import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { ACCESS_TOKEN_NAME, HOME_URL, REFRESH_TOKEN_NAME } from "@/util/constants";
import type { ApiResponse } from "@/schema/api-response";
import { SignInSchema, type SignIn } from "@/schema/sign-in";

export const POST: APIRoute = async ({ request, cookies }) => {
	const body = await request.json() as SignIn;
	const parsedData = SignInSchema.safeParse({
		email: body.email,
		password: body.password
	});

	if (!parsedData.success) {
		const response: ApiResponse = {
			error: "validation_error",
			message: parsedData.error.format(),
		}
		return Response.json(response, {
			status: 400
		})
	}

	const { email, password } = parsedData.data;

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		const response: ApiResponse = {
			error: "authentication_error",
			message: error.message
		}
		return Response.json(response, {
			status: 500
		});
	}

	const { access_token, refresh_token } = data.session;
	cookies.set(ACCESS_TOKEN_NAME, access_token, {
		path: "/",
	});
	cookies.set(REFRESH_TOKEN_NAME, refresh_token, {
		path: "/",
	});
	const response = {
		message: "Sesión iniciada",
		data: null,
	} as ApiResponse;

	return Response.json(response, {
		status: 200
	})

};
