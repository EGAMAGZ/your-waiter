type ApiErrors =
  | "authentication_error"
  | "validation_error"
  | "server_error";

type SuccesApiReponse<T> = {
  message: string;
  data: T;
  error?: never;
};

type ErrorApiReponse = {
  error: ApiErrors;
  message: string | any;
  data?: never;
};

export type ApiResponse<T = null> = SuccesApiReponse<T> | ErrorApiReponse;
