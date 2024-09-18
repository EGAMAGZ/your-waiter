import { z } from "zod";

export type DishAvailability = {
  name: string;
  quantity: number;
};

export const DishAvailabilitySearchSchema = z.object({
  dishName: z.string({
    required_error: "Nombre de platillo es requerido",
    invalid_type_error: "Nombre de platillo debe ser texto plano",
  }).trim(),
});

export type DishAvailabilitySearch = z.infer<
  typeof DishAvailabilitySearchSchema
>;
