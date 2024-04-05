export type ErrorResponse = { success: false; error: string };

export type APIFunctionReturn<T> =
  | {
      success: true;
      data: T;
    }
  | ErrorResponse;
