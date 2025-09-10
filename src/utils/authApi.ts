import { apiClient } from "./api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/authApi";
import { UserModel } from "@/types/userModel";

export const authApi = {
  async login(credentials: LoginRequest) {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  async register(userData: RegisterRequest) {
    return apiClient.post<AuthResponse>("/auth/register", userData);
  },

  async getCurrentUser() {
    return apiClient.get<UserModel>("/auth/me");
  },

  async logout() {
    localStorage.removeItem("auth_token");
  },
};
