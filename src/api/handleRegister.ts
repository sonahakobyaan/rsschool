import type { RegisterResult, RegisterSuccessResponse } from "@/types/user";
import { BASE_URL } from "@/api/constant.ts";

export async function handleRegister(credentials: {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: "cash" | "card";
}): Promise<RegisterResult> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
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
      data: result as RegisterSuccessResponse,
    };
  }

  let errorMessage = "Registration failed";

  if (result && typeof result === "object") {
    if ("message" in result) {
      if (Array.isArray(result.message)) {
        errorMessage = result.message[0];
      } else if (typeof result.message === "string") {
        errorMessage = result.message;
      }
    } else if ("error" in result && typeof result.error === "string") {
      errorMessage = result.error;
    }
  }

  if (response.status === 409) {
    errorMessage = "User with this login already exists";
  } else if (response.status === 400) {
    errorMessage = errorMessage || "Invalid data provided";
  }

  return {
    success: false,
    error: errorMessage,
    status: response.status,
  };
}
