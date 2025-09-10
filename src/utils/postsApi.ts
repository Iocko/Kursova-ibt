import { apiClient } from "./api";
import { PostModel } from "@/types/postModel";

export const postsApi = {
  async getAllPosts() {
    return apiClient.get<PostModel[]>("/posts");
  },

  async getPostById(id: string) {
    return apiClient.get<PostModel>(`/posts/${id}`);
  },

  async getUserPosts() {
    return apiClient.get<PostModel[]>("/posts/user");
  },

  async createPost(title: string, content: string) {
    return apiClient.post<PostModel>("/posts", { title, content });
  },

  async updatePost(id: string, title: string, content: string) {
    return apiClient.put<PostModel>(`/posts/${id}`, { title, content });
  },

  async deletePost(id: string) {
    return apiClient.delete<{ message: string }>(`/posts/${id}`);
  },
};
