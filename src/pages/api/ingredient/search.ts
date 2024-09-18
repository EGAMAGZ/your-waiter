import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import {
  type Ingredient,
  type IngredientSearch,
  IngredientSearchSchema,
} from "@/schema/ingredient";
import type { QueryData } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json() as IngredientSearch;
  const parsedData = IngredientSearchSchema.safeParse({
    ingredientName: body.ingredientName,
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

  const { ingredientName } = parsedData.data;

  const ingredientsQuery = supabase
    .from("Ingrediente Extra")
    .select("id_ingrediente,txt_nombre,nu_precio")
    .ilike("txt_nombre", `%${ingredientName}%`);

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
  } as Ingredient));

  const response: ApiResponse<Ingredient[]> = {
    data: ingredients,
    message: "Successfully found ingredients information",
  };

  return Response.json(response, {
    status: 200,
  });
};

export const GET: APIRoute = async () => {
  const ingredientsQuery = supabase
    .from("Ingrediente Extra")
    .select("id_ingrediente,txt_nombre,nu_precio");

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
  } as Ingredient));

  const response: ApiResponse<Ingredient[]> = {
    data: ingredients,
    message: "Successfully found ingredients information",
  };

  return Response.json(response, {
    status: 200,
  });
};
