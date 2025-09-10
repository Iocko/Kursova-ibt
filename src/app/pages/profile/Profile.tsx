import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { userApi } from "@/utils/userApi";
import { postsApi } from "@/utils/postsApi";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/utils/authApi";
import { PostModel } from "@/types/postModel";
import { ProfileForm } from "./components/ProfileForm";
import { NewPost } from "../posts/new/NewPost";

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsApi.getUserPosts();
        if (response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  const handleProfileUpdate = async (values: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      const updateData = {
        name: values.name,
        ...(values.newPassword && {
          currentPassword: values.currentPassword,
          password: values.newPassword,
        }),
      };

      const response = await userApi.updateProfile(updateData);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Update the auth context with the new user data
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.data) {
          // This will update the user state throughout the app
          setUser(userResponse.data);
        }
      }
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{
                id: user?.id || "",
                name: user?.name || "",
              }}
              onSubmit={handleProfileUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id}>
                    {editingPostId === post.id ? (
                      <NewPost
                        initialPost={post}
                        onCancel={() => setEditingPostId(null)}
                      />
                    ) : (
                      <div className="p-4 border rounded-lg hover:bg-gray-50">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            navigate({
                              to: "/posts/$id",
                              params: { id: post.id },
                            })
                          }
                        >
                          <h3 className="text-lg font-semibold mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="mt-2 text-sm text-gray-500">
                            Posted on{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                            {post.updatedAt !== post.createdAt && (
                              <span className="ml-2 italic">
                                • Edited{" "}
                                {new Date(post.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPostId(post.id);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this post?"
                                )
                              ) {
                                try {
                                  const deleteResponse =
                                    await postsApi.deletePost(post.id);
                                  if (deleteResponse.error) {
                                    setError(deleteResponse.error);
                                    return;
                                  }

                                  const response =
                                    await postsApi.getUserPosts();
                                  if (response.data) {
                                    setPosts(response.data);
                                  }
                                } catch (err) {
                                  setError("Failed to delete post");
                                }
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  You haven't created any posts yet
                </p>
                <Button onClick={() => navigate({ to: "/posts/new" })}>
                  Create Your First Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
