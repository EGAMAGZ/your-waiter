import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const parsedData = z.coerce.number({
    required_error: "Id de ingrediente es requerido",
    invalid_type_error: "Id de ingrediente deber ser número",
  })
    .positive({
      message: "Id de platillo debe ser mayor a 0",
    }).safeParse(id);

  if (!parsedData.success) {
    const response: ApiResponse = {
      message: parsedData.error.format(),
      error: "validation_error",
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const idIngredient = parsedData.data;

  const ingredientQuery = supabase
    .from("Ingrediente Extra")
    .delete()
    .eq("id_ingrediente", idIngredient);

  const { error } = await ingredientQuery;

  if (error) {
    const reponse: ApiResponse = {
      message: error.message,
      error: "server_error",
    };

    return Response.json(reponse, {
      status: 500,
    });
  }

  const response: ApiResponse<number> = {
    message: "Ingredient deleted correctly",
    data: idIngredient,
  };
  return Response.json(response, {
    status: 200,
  });
};
