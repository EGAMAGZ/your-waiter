import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const GET: APIRoute = async ({ params }) => {
  const tableId = z.coerce.number({
    required_error: "Id de mesa es requerido",
    invalid_type_error: "Id de mesa debe ser número",
  }).positive({
    message: "Id de mesa debe ser mayor a 0",
  }).int({
    message: "Id de mesa debe ser entero",
  }).safe({
    message: "Id de mesa es un valor muy grande",
  }).safeParse(params.id);

  if (!tableId.success) {
    const response: ApiResponse = {
      error: "validation_error",
      message: tableId.error.format(),
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const getTableInfo = supabase
    .from("Cuenta")
    .select("id_cuenta")
    .eq("fk_id_mesa", tableId.data)
    .eq("nu_estado_cuenta", false)
    .single();

  const { data, error } = await getTableInfo;

  if (error) {
    const response: ApiResponse = {
      error: "server_error",
      message: error.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  let billId: number | null = null;

  if (data) {
    billId = data.id_cuenta;
  }

  const response: ApiResponse<number | null> = {
    message: "Table found succesfully",
    data: billId,
  };

  return Response.json(response, {
    status: 200,
  });
};
