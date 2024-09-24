import type { TableStatus } from "@/util/table";
import { z } from "zod";

export const TableSchema = z.object({
  id: z.number({
    required_error: "Id de mesa es requerido",
    invalid_type_error: "Id de mesa debe ser número",
  }).positive({ message: "Id de mesa debe ser mayor a 0" }).int({
    message: "Id de mesa debe ser entero",
  }).safe({
    message: "Id de mesa es un valor muy grande",
  }),
  numberTable: z.coerce.number({
    required_error: "Número de mesa es requerido",
    invalid_type_error: "Número de mesa debe ser número",
  }).positive({ message: "Número de mesa debe ser mayor a 0" }).int({
    message: "Número de mesa debe ser entero",
  }).safe({
    message: "Número de mesa es un valor muy grande",
  }),
  status: z.enum(["free", "in_process", "busy", "completed"]).transform(
    (value) => value as TableStatus,
  ),
});

export type Table = z.infer<typeof TableSchema>;

export const UpdateTableStatusSchema = TableSchema.pick({
  status: true,
});

export type UpdateTableStatus = z.infer<typeof UpdateTableStatusSchema>;
