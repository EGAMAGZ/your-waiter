import { z } from "zod";

export type DishAvailability = {
  name: string;
  quantity: number;
};

export const DishSearchSchema = z.object({
  dishName: z.string({
    required_error: "Nombre de platillo es requerido",
    invalid_type_error: "Nombre de platillo debe ser texto plano",
  }).trim(),
});

export type DishSearch = z.infer<
  typeof DishSearchSchema
>;

export type Dish = {
  id: number;
  name: string;
  price: number;
};
