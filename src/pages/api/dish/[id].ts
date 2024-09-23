import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const parsedData = z.coerce.number({
    required_error: "Id de platillo es requerido",
    invalid_type_error: "Id de platillo deber ser un número",
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

  const idDish = parsedData.data;
  const dishQuery = supabase
    .from("Platillo")
    .delete()
    .eq("id_platillo", idDish);

  const { error } = await dishQuery;

  if (error) {
    const response: ApiResponse = {
      message: error.message,
      error: "server_error",
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const response: ApiResponse<number> = {
    message: "Dish deleted correctly",
    data: idDish,
  };
  return Response.json(response, {
    status: 200,
  });
};
