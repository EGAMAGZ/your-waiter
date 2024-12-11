import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const PUT: APIRoute = async ({ params }) => {
  const billId = z.coerce.number({
    required_error: "Id de cuenta es requerido",
    invalid_type_error: "Id de cuanta debe ser un número",
  }).positive({
    message: "Id de cuenta debe ser mayor a 0",
  }).safe({
    message: "Id de cuenta es un valor muy grande",
  }).safeParse(params.id);

  if (!billId.success) {
    const response: ApiResponse = {
      message: billId.error.format(),
      error: "validation_error",
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const updateBill = supabase
    .from("Cuenta")
    .update({
      nu_estado_cuenta: true,
    }).eq("id_cuenta", billId.data);

  const { error } = await updateBill;

  if (error) {
    const response: ApiResponse = {
      message: error.message,
      error: "server_error",
    };
    console.log("Bill status update error response:", response);
    return Response.json(response, {
      status: 500,
    });
  }

  const response: ApiResponse<boolean> = {
    message: "Updated bill status",
    data: true,
  };

  return Response.json(response, {
    status: 200,
  });
};
