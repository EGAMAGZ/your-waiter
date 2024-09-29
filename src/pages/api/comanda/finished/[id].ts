import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const PUT: APIRoute = async ({ params }) => {
  const comandaId = z.coerce.number({
    required_error: "Id de comanda es requerido",
    invalid_type_error: "Id de comanda deber ser número",
  }).positive({
    message: "Id de comanda debe ser mayora 0",
  }).safe({
    message: "Id de comanda es un valor muy grande",
  }).safeParse(params.id);

  if (!comandaId.success) {
    const response: ApiResponse = {
      error: "validation_error",
      message: comandaId.error.format(),
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const updateComanda = supabase
    .from("Comanda")
    .update({
      st_terminada: true,
    })
    .eq("id_comanda", comandaId.data)
    .select()
    .single();

  const { error } = await updateComanda;

  if (error) {
    const response: ApiResponse = {
      error: "server_error",
      message: error.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const response: ApiResponse<boolean> = {
    message: "Updated finish status of comanda",
    data: true,
  };

  return Response.json(response, {
    status: 200,
  });
};
