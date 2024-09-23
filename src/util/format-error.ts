import { z } from "zod";

export type FormErrors<Schema> = {
  [key in keyof Schema]?: string;
};

export function formatError<Schema>(error: z.ZodError<Schema>) {
  const fieldErrors = error.flatten().fieldErrors as Record<
    keyof Schema,
    string[]
  >;

  return Object.keys(fieldErrors).reduce((errors, key) => {
    errors[key as keyof typeof fieldErrors] =
      fieldErrors[key as keyof typeof fieldErrors][0] as string;
    return errors;
  }, {} as FormErrors<Schema>);
}
