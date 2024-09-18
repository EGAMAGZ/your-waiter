import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import { type Dish, type DishSearch, DishSearchSchema } from "@/schema/dish";
import type { QueryData } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json() as DishSearch;
  const parsedData = DishSearchSchema.safeParse({
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
    .select(
      "id_platillo,txt_nombre,nu_precio",
    )
    .ilike("txt_nombre", `%${dishName}%`);

  const { data, error: dishesError } = await dishesQuery;

  if (dishesError) {
    const response: ApiResponse = {
      message: dishesError.message,
      error: "server_error",
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const dishesData: QueryData<typeof dishesQuery> = data;

  const dishes = dishesData.map((dish) => ({
    id: dish.id_platillo,
    name: dish.txt_nombre,
    price: dish.nu_precio,
  } as Dish));

  const response: ApiResponse<Dish[]> = {
    data: dishes,
    message: "Successfully found dishes information",
  };

  return Response.json(response, {
    status: 200,
  });
};

export const GET: APIRoute = async () => {
  const dishesQuery = supabase
    .from("Platillo")
    .select(
      "id_platillo,txt_nombre,nu_precio",
    );

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

  const dishes = dishesData.map((dish) => ({
    id: dish.id_platillo,
    name: dish.txt_nombre,
    price: dish.nu_precio,
  } as Dish));

  const response: ApiResponse<Dish[]> = {
    data: dishes,
    message: "Successfully found dishes information",
  };

  return Response.json(response, {
    status: 200,
  });
};
