import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import {
  type Ingredient,
  IngredientSchema,
  type IngredientSearch,
  IngredientSearchSchema,
} from "@/schema/ingredient";
import type { QueryData } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const parsedData = IngredientSearchSchema.safeParse({
    name: url.searchParams.get("name"),
  });

  if (!parsedData.success) {
    const response: ApiResponse = {
      message: parsedData.error.format(),
      error: "validation_error",
    };
    return Response.json(response, {
      status: 400,
    });
  }

  const { name } = parsedData.data;

  const ingredientsQuery = supabase
    .from("Ingrediente Extra")
    .select("*")
    .ilike("txt_nombre", `%${name || ""}%`);

  const { data, error: ingredientError } = await ingredientsQuery;

  if (ingredientError) {
    const response: ApiResponse = {
      message: ingredientError.message,
      error: "server_error",
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const ingredientsData: QueryData<typeof ingredientsQuery> = data;

  const ingredients = ingredientsData.map((ingredient) => ({
    id: ingredient.id_ingrediente,
    name: ingredient.txt_nombre,
    price: ingredient.nu_precio,
    quantity: ingredient.nu_cantidad,
  } as Ingredient));

  const response: ApiResponse<Ingredient[]> = {
    data: ingredients,
    message: "Successfully found ingredients information",
  };

  return Response.json(response, {
    status: 200,
  });
};
