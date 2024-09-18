import { z } from "zod";

export type Ingredient = {
  id: number;
  name: string;
  price: number;
};

export const IngredientSearchSchema = z.object({
  ingredientName: z.string({
    required_error: "Nombre de ingrediente requerido",
    invalid_type_error: "Nombre de ingrediente debe ser texto plano",
  })
    .trim()
    .default(""),
});

export type IngredientSearch = z.infer<typeof IngredientSearchSchema>;
