export type ApiResponse<T = null> = {
    message: string;
    data: T;
    error?: string;
}