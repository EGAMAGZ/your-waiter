import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import {
  type DishAvailability,
  type DishAvailabilitySearch,
  DishAvailabilitySearchSchema,
} from "@/schema/dish";
import type { QueryData } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json() as DishAvailabilitySearch;
  const parsedData = DishAvailabilitySearchSchema.safeParse({
    dishName: body.dishName,
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

  const { dishName } = parsedData.data;

  const dishesQuery = supabase
    .from("Platillo")
    .select("txt_nombre,nu_cantidad")
    .ilike("txt_nombre", `%${dishName}%`);

  const { data, error: dishesError } = await dishesQuery;

  if (dishesError) {
    const response = {
      message: dishesError.message,
      error: "server_error",
    } as ApiResponse;

    return Response.json(response, {
      status: 500,
    });
  }

  const dishesData: QueryData<typeof dishesQuery> = data;

  const dishesAvailability = dishesData.map((
    dish,
  ) => ({
    name: dish.txt_nombre,
    quantity: dish.nu_cantidad,
  } as DishAvailability));

  const response: ApiResponse<DishAvailability[]> = {
    data: dishesAvailability,
    message: "Sucessfully found dish availability ",
  };

  return Response.json(response, {
    status: 200,
  });
};

export const GET = async () => {
  const dishesQuery = supabase
    .from("Platillo")
    .select("txt_nombre,nu_cantidad");

  const { data, error: dishesError } = await dishesQuery;

  if (dishesError) {
    const response = {
      message: dishesError.message,
      error: "server_error",
    } as ApiResponse;

    return Response.json(response, {
      status: 500,
    });
  }

  const dishesData: QueryData<typeof dishesQuery> = data;

  const dishesAvailability = dishesData.map((
    dish,
  ) => ({
    name: dish.txt_nombre,
    quantity: dish.nu_cantidad,
  } as DishAvailability));

  const response: ApiResponse<DishAvailability[]> = {
    data: dishesAvailability,
    message: "Sucessfully found dish availability ",
  };
  return Response.json(response, {
    status: 200,
  });
};
