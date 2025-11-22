export interface ConfirmOrderSuccessResponse {
    data: Record<string, object>;
    message?: string;
    error?: never;
  }
  
  export interface ConfirmOrderErrorResponse {
    error: string;
    isTestError?: boolean;
    timestamp?: string;
  }
  
  export type ConfirmOrderResponse =
    | ConfirmOrderSuccessResponse
    | ConfirmOrderErrorResponse;
  
  export type ConfirmOrderResult =
    | {
        success: true;
        data: ConfirmOrderSuccessResponse;
        error?: never;
        status: number;
      }
    | {
        success: false;
        error: string;
        data?: never;
        status: number;
      };