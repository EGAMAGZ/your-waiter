import NotificationOrderController from "@/controllers/notification-orders";
import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import { z } from "zod";

export const PUT: APIRoute = async ({ params }) => {
  const orderId = z.coerce.number({
    required_error: "Id de orden es requerido",
    invalid_type_error: "Id de orden deber ser número",
  }).positive({
    message: "Id de orden debe ser mayor a 0",
  }).safe({
    message: "Id de orden es un valor muy grande",
  }).safeParse(params.id);

  if (!orderId.success) {
    const response: ApiResponse = {
      error: "validation_error",
      message: orderId.error.format(),
    };

    return Response.json(response, {
      status: 400,
    });
  }

  const updateOrder = supabase
    .from("Orden")
    .update({
      st_terminado: true,
    })
    .eq("id", orderId.data)
    .select("Comanda(Cuenta(Mesa(nu_mesa)))")
    .single();

  const { error, data } = await updateOrder;

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
    message: "Updated finish status of order",
    data: true,
  };

  NotificationOrderController.getInstance().sendNotification({ orderId: orderId.data, tableNumber: data.Comanda?.Cuenta?.Mesa?.nu_mesa });

  return Response.json(response, {
    status: 200,
  });
};
