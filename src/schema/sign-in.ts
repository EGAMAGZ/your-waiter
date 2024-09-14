import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string({
    required_error: "Correo es obligatorio",
    invalid_type_error: "Correo debe ser texto plano",
  }).email({
    message: "Correo no es valido",
  }),
  password: z.string({
    required_error: "Contraseña es obligatoria",
    invalid_type_error: "Contraseña debe ser texto plano",
  }).min(6, {
    message: "Contraseña debe tener al menos 6 caracteres",
  }),
});

export type SignIn = z.infer<typeof SignInSchema>;
