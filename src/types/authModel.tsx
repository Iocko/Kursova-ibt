import { UserModel } from "./userModel";

export interface AuthModel {
  user: UserModel;
  isAuthenticated: boolean;
}
