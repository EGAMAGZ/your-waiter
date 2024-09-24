import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import {
  type UpdateTableStatus,
  UpdateTableStatusSchema,
} from "@/schema/table";
import { type TableStatus, tableStatus } from "@/util/table";
import type { APIRoute } from "astro";
import { z } from "zod";

export const PUT: APIRoute = async ({ request, params }) => {
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
    return Response.json(response, { status: 400 });
  }

  const body = await request.json() as UpdateTableStatus;

  const parsedData = UpdateTableStatusSchema.safeParse(body);

  if (!parsedData.success) {
    const response: ApiResponse = {
      error: "validation_error",
      message: parsedData.error.format(),
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const updateStatus = supabase
    .from("Mesa")
    .update({
      fk_id_edo_mesa: tableStatus[body.status],
    }).eq("id_mesa", tableId.data);
  const { error } = await updateStatus;

  if (error) {
    const response: ApiResponse = {
      error: "server_error",
      message: error.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const response: ApiResponse<TableStatus> = {
    message: "Updated status of table",
    data: body.status,
  };

  return Response.json(response, {
    status: 200,
  });
};
