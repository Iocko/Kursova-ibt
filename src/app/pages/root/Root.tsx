import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postsApi } from "@/utils/postsApi";
import { PostModel } from "@/types/postModel";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export function Root() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log("Fetching posts...");
        const response = await postsApi.getAllPosts();
        console.log("Posts API response:", response);

        if (response.data) {
          console.log("Posts data:", response.data);
          setPosts(response.data);
        } else {
          console.log("No posts data, error:", response.error);
          setError(response.error || "Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Posts</h1>
        {isAuthenticated && (
          <Button onClick={() => navigate({ to: "/posts/new" })}>
            Create New Post
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No posts available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              onClick={() =>
                navigate({ to: "/posts/$id", params: { id: post.id } })
              }
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>
                  By {post.author.name} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.content}
                </p>
              </CardContent>
              <CardFooter>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{post.comments.length} comments</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
