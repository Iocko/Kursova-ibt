import { apiClient } from "./api";
import { UserModel } from "@/types/userModel";

export interface UpdateProfileData {
  name?: string;
  password?: string;
  currentPassword?: string;
}

export const userApi = {
  async updateProfile(data: UpdateProfileData) {
    return apiClient.put<UserModel>("/auth/profile", data);
  },
};
