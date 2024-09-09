export type ValidationResult = {
    message: string;
    status: "authorized" | "unauthorized" | "error";
}