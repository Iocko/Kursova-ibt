import { BaseModel } from "./baseModel";
import { UserModel } from "./userModel";

export interface CommentModel extends BaseModel {
  content: string;
  postId: string;
  author: Pick<UserModel, "id" | "name">;
  createdAt: string;
  updatedAt: string;
}

export interface PostModel extends BaseModel {
  title: string;
  content: string;
  published: boolean;
  author: Pick<UserModel, "id" | "name" | "email">;
  comments: CommentModel[];
  createdAt: string;
  updatedAt: string;
}
