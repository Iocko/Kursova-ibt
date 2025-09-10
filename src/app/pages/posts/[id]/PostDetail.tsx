import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postsApi } from "@/utils/postsApi";
import { commentsApi } from "@/utils/commentsApi";
import { PostModel } from "@/types/postModel";
import useAuth from "@/hooks/auth/useAuth";
import { CommentForm } from "./components/CommentForm";
import { CommentItem } from "./components/CommentItem";

export function PostDetail() {
  const { id } = useParams({ from: "/posts/$id" });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<PostModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await postsApi.getPostById(id);

        if (response.data) {
          setPost(response.data);
        } else {
          setError(response.error || "Failed to fetch post");
        }
      } catch (err) {
        setError("An error occurred while fetching the post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Post not found"}</p>
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          className="mb-4"
        >
          ← Back to Posts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <CardDescription className="text-lg">
            By {post.author.name} •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {post.published ? "Published" : "Draft"}
              </span>
              <span>
                Last updated: {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Comments ({post.comments.length})
            </h3>
            {post.comments.length > 0 ? (
              <div className="space-y-4">
                {[...post.comments]
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onEdit={async (commentId, content) => {
                        try {
                          await commentsApi.updateComment(commentId, content);
                          // Refresh the post to get the updated comment
                          const postResponse = await postsApi.getPostById(
                            post.id
                          );
                          if (postResponse.data) {
                            setPost(postResponse.data);
                          }
                        } catch (err) {
                          setError(
                            "Failed to update comment. Please try again."
                          );
                        }
                      }}
                      onDelete={async (commentId) => {
                        try {
                          await commentsApi.deleteComment(commentId);
                          // Refresh the post to get the updated comments list
                          const postResponse = await postsApi.getPostById(
                            post.id
                          );
                          if (postResponse.data) {
                            setPost(postResponse.data);
                          }
                        } catch (err) {
                          setError(
                            "Failed to delete comment. Please try again."
                          );
                        }
                      }}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No comments yet</p>
            )}

            {isAuthenticated ? (
              <CommentForm
                onCommentSubmit={async (content) => {
                  try {
                    const response = await commentsApi.createComment(
                      post.id,
                      content
                    );
                    if (response.data) {
                      // Refresh the post to get the new comment
                      const postResponse = await postsApi.getPostById(post.id);
                      if (postResponse.data) {
                        setPost(postResponse.data);
                      }
                    }
                  } catch (err) {
                    setError("Failed to submit comment. Please try again.");
                  }
                }}
              />
            ) : (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Please{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    log in
                  </Button>{" "}
                  to add a comment.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
