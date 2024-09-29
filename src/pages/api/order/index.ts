import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { CreateOrder } from "@/schema/order";
import type { APIRoute } from "astro";

async function updateDishCount(dishId: number[]) {

  const dishCount = dishId.reduce((acc: Record<number, number>, curr) => {
    if (acc[curr]) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }
    return acc;
  }, {});

  console.log(dishId);
  const dishQuantity = supabase
    .from("Platillo")
    .select("id_platillo, nu_cantidad")
    .in("id_platillo", Object.keys(dishCount)); 

  const { data: dishQuantityData, error: dishQuantityError } = await dishQuantity;

  if (dishQuantityError) {
    return dishQuantityError;
  }

  dishQuantityData.forEach(async (dish) => {
    const updateDish = supabase
      .from("Platillo")
      .update({
        nu_cantidad: dish.nu_cantidad - dishCount[dish.id_platillo],
      })
      .eq("id_platillo", dish.id_platillo);

    await updateDish;
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json() as CreateOrder;

  const createBill = supabase
    .from("Cuenta")
    .insert([{
      fk_id_mesa: body.idTable,
      fk_id_trabajador: locals.worker.id,
    }])
    .select("id_cuenta")
    .single();

  const { data: billData, error: billError } = await createBill;

  if (billError) {
    const response: ApiResponse = {
      error: "server_error",
      message: billError.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const createComanda = supabase
    .from("Comanda").insert([
      {
        fk_id_cuenta: billData.id_cuenta,
      },
    ]).select().single();

  const { data: comandaData, error: comandaError } = await createComanda;

  if (comandaError) {
    const response: ApiResponse = {
      error: "server_error",
      message: comandaError.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }
  const inserts = body.dishes.map((dish) => ({
    fk_id_platillo: dish,
    fk_id_comanda: comandaData.id_comanda,
  }));

  const createOrder = supabase.from("Orden")
    .insert(inserts)
    .select();

  const { data: orderData, error: orderError } = await createOrder;
  if (orderError) {
    const response: ApiResponse = {
      error: "server_error",
      message: orderError.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const updateDishError = await updateDishCount(body.dishes);
  if (updateDishError) {
    const response: ApiResponse = {
      error: "server_error",
      message: updateDishError.message,
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const response: ApiResponse<any> = {
    message: "Order created succesfully",
    data: orderData,
  };

  return Response.json(response, {
    status: 200,
  });
};
