import { apiClient } from "./api";
import { CommentModel } from "@/types/postModel";

export const commentsApi = {
  async createComment(postId: string, content: string) {
    return apiClient.post<CommentModel>(`/comments`, {
      postId,
      content,
    });
  },

  async updateComment(commentId: string, content: string) {
    return apiClient.put<CommentModel>(`/comments/${commentId}`, {
      content,
    });
  },

  async deleteComment(commentId: string) {
    return apiClient.delete<{ message: string }>(`/comments/${commentId}`);
  },
};
