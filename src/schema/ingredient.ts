import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.number({
    required_error: "Id de ingrediente es requerido",
    invalid_type_error: "Id de ingrediente debe ser número",
  }).positive({
    message: "Id de ingrediente debe ser positivo",
  }).int({
    message: "Id de ingrediente debe ser ser entero",
  }).safe({
    message: "Id de platillo es un valor muy grande",
  }),
  name: z.string({
    required_error: "Nombre de ingrediente es requerido",
    invalid_type_error: "Nombre de ingrediente debe ser texto plano",
  }).min(1, {
    message: "Nombre de platillo no puede estar vacio",
  }).trim(),
  quantity: z.coerce.number({
    invalid_type_error: "Cantidad del platillo debe ser número",
    required_error: "Cantidad del platillo es requerido",
  }).nonnegative({
    message: "Debe ser postivo la cantidad del platillo",
  }).safe({
    message: "Cantidad del platilla es un valor muy grande",
  }).default(0),
  price: z.coerce.number({
    invalid_type_error: "Precio del platillo debe ser número",
    required_error: "Precio del platillo es requerido",
  }).positive({
    message: "Precio del platillo debe ser mayor a 0",
  }),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const IngredientSearchSchema = z.object({
  name: z.string({
    required_error: "Nombre de ingrediente es requerido",
    invalid_type_error: "Nombre de ingrediente debe ser texto plano",
  }).nullish(),
});

export type IngredientSearch = z.infer<typeof IngredientSearchSchema>;
