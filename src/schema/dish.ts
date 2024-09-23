import { z } from "zod";

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
  }),
  ingredients: z.coerce.number({
    required_error: "Id ingrediente es requerido",
    invalid_type_error: "Id de ingrediente deve ser positivo",
  }).positive({
    message: "Id de ingrediente debe ser positivo",
  }).int({
    message: "Id de ingrediente deber ser entero",
  }).array()
    .optional(),
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

export const CreateDishSchema = DishSchema.omit({
  id: true,
});

export type CreateDish = z.infer<typeof CreateDishSchema>;

const DishAvailability = DishSchema.pick({
  name: true,
  quantity: true,
});

export type DishAvailability = z.infer<typeof DishAvailability>;
