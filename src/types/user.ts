type User = {
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

export type LoginResult =
  | { success: true; data: LoginSuccessResponse }
  | { success: false; error: string; status: number };

export type RegisterSuccessResponse = {
  message: string;
  user?: {
    id: string | number;
    login: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    paymentMethod?: "cash" | "card";
    createdAt?: string;
  };
};

export type RegisterResult =
  | { success: true; data: RegisterSuccessResponse }
  | { success: false; error: string; status: number };
