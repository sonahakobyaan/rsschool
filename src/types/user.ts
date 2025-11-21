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
