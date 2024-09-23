import { z } from "zod";

export const DishSchema = z.object({
  id: z.number({
    required_error: "Id de platillo es requerido",
    invalid_type_error: "Id de platillo debe ser número",
  }).positive({
    message: "Id de platillo debe ser positivo",
  }).int({
    message: "Id de platillo deber ser entero",
  }).safe({
    message: "Id de platillo es un valor muy grande",
  }),
  name: z.string({
    required_error: "Nombre de platillo es requerido",
    invalid_type_error: "Nombre de platillo debe ser texto plano",
  }).min(1, {
    message: "Nombre de platillo no puede estar vacio",
  }).trim(),
  ingredients: z.preprocess(
    (value) => (Array.isArray(value) ? value.map(Number) : [Number(value)]),
    z.coerce.number({
      invalid_type_error: "Id de ingrediente debe ser número",
      required_error: "Id de ingrediente es requerido",
    }).array(),
  ).optional(),
  quantity: z.coerce.number({
    invalid_type_error: "Cantidad del platillo debe ser número",
    required_error: "Cantidad del platillo es requerido",
  }).positive({
    message: "Cantidad del platillo debse ser mayor a 0",
  }).safe({
    message: "Cantidad del platilla es un valor muy grande",
  }),
  price: z.coerce.number({
    invalid_type_error: "Precio del platillo debe ser número",
    required_error: "Precio del platillo es requerido",
  }).positive({
    message: "Precio del platillo debe ser mayor a 0",
  }),
});

export type Dish = z.infer<typeof DishSchema>;

export const CreateDishSchema = DishSchema.omit({
  id: true,
});

export type CreateDish = z.infer<typeof CreateDishSchema>;

const DishAvailability = DishSchema.pick({
  name: true,
  quantity: true,
});

export type DishAvailability = z.infer<typeof DishAvailability>;

export const DishSearchSchema = z.object({
  name: z.string({
    required_error: "Nombre de platillo es requerido",
    invalid_type_error: "Nombre de platillo debe ser texto plano",
  }).nullish(),
});

export type DishSearch = z.infer<
  typeof DishSearchSchema
>;
