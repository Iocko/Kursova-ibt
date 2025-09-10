import { BaseModel } from "./baseModel";

export interface UserModel extends BaseModel {
  email: string;
  name: string;
}
