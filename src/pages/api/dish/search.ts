import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import { type Dish, DishSearchSchema } from "@/schema/dish";
import type { QueryData } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const parsedData = DishSearchSchema.safeParse({
    name: url.searchParams.get("name"),
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

  const { name } = parsedData.data;

  const dishesQuery = supabase
    .from("Platillo")
    .select("*")
    .ilike("txt_nombre", `%${name || ""}%`);

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
    quantity: dish.nu_cantidad,
  } as Dish));

  const response: ApiResponse<Dish[]> = {
    data: dishes,
    message: "Successfully found dishes information",
  };

  return Response.json(response, {
    status: 200,
  });
};
