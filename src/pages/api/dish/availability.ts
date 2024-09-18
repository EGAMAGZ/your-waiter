import type { ApiResponse } from "@/schema/api-response";
import {
  type DishAvailability,
  type DishAvailabilitySearch,
  DishAvailabilitySearchSchema,
} from "@/schema/dish";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json() as DishAvailabilitySearch;
  console.log(body);
  const parsedData = DishAvailabilitySearchSchema.safeParse({
    dishName: body.dishName,
  });
  console.log(parsedData);

  const response: ApiResponse<DishAvailability[]> = {
    data: [],
    message: "Sucessfully found dish availability ",
  };
  return Response.json(response, {
    status: 200,
  });
};
