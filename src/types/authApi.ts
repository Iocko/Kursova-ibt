import { UserModel } from "./userModel";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  user: UserModel;
  token: string;
};

export type AuthError = {
  message: string;
};
