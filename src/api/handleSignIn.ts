import { BASE_URL } from "@/api/constant.ts";

export type User = {
  id: string | number;
  login: string;
  city?: string;
  createdAt?: string;
  houseNumber?: string;
  paymentMethod?: string;
  street?: string;
};

export type LoginSuccessResponse = {
  access_token: string;
  user: User;
};

export type LoginErrorResponse = {
  error: string;
  message?: string;
};

export type LoginResult =
  | { success: true; data: LoginSuccessResponse }
  | { success: false; error: string; status: number };

export async function login(credentials: {
  login: string;
  password: string;
}): Promise<LoginResult> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
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

  if (response.status === 201) {
    if (
      result &&
      typeof result === "object" &&
      "data" in result &&
      result.data &&
      typeof result.data === "object" &&
      "access_token" in result.data &&
      "user" in result.data
    ) {
      return {
        success: true,
        data: result.data as LoginSuccessResponse,
      };
    }
  }

  const errorMessage =
    result &&
    typeof result === "object" &&
    "error" in result &&
    typeof result.error === "string"
      ? result.error
      : "Login failed";

  return {
    success: false,
    error:
      response.status === 401 ? "Incorrect login or password" : errorMessage,
    status: response.status,
  };
}
