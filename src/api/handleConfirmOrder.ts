import type { ConfirmOrderResult, ConfirmOrderSuccessResponse } from "@/types/order.ts";
import { BASE_URL } from "@/api/constant.ts";

export async function handleConfirmOrder(payload: {
  items: Array<{
    productId: number | string;
    size: string;
    additives?: string[];
    quantity: number;
  }>;
  totalPrice: number;
}): Promise<ConfirmOrderResult> {
  const response = await fetch(`${BASE_URL}/orders/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    return {
      success: false,
      error: "Invalid response from server",
      status: response.status,
    };
  }

  if (response.ok) {
    return {
      success: true,
      status: response.status,
      data: result as ConfirmOrderSuccessResponse,
    };
  }

  let errorMessage = "Failed to confirm order";

  if (result && typeof result === "object") {
    if ("error" in result && typeof result.error === "string") {
      errorMessage = result.error;
    } else if ("message" in result && typeof result.message === "string") {
      errorMessage = result.message;
    }
  }

  if (response.status === 500) {
    errorMessage = errorMessage.includes("Simulated")
      ? "Temporary server issue – please try again later"
      : errorMessage;
  } else if (response.status === 400) {
    errorMessage = "Invalid order data";
  } else if (response.status === 401 || response.status === 403) {
    errorMessage = "Unauthorized – please log in again";
  }

  return {
    success: false,
    error: errorMessage,
    status: response.status,
  };
}