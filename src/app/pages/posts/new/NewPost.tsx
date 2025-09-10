import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/form/Form";
import { FormInput } from "@/components/form/FormInput";
import { FormError } from "@/components/form/FormError";
import { postsApi } from "@/utils/postsApi";
import { requiredString } from "@/utils";
import { z } from "zod";

const schema = z.object({
  title: requiredString.min(3, "Title must be at least 3 characters"),
  content: requiredString.min(10, "Content must be at least 10 characters"),
});

type NewPostFormData = z.infer<typeof schema> & { id: string };

const getDefaultValues = (
  initialPost?: PostFormProps["initialPost"]
): NewPostFormData => ({
  id: initialPost?.id || "",
  title: initialPost?.title || "",
  content: initialPost?.content || "",
});

interface PostFormProps {
  initialPost?: {
    id: string;
    title: string;
    content: string;
  };
  onCancel?: () => void;
}

export function NewPost({ initialPost, onCancel }: PostFormProps = {}) {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: Partial<NewPostFormData>) => {
    if (!values.title || !values.content) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = initialPost
        ? await postsApi.updatePost(
            initialPost.id,
            values.title!,
            values.content!
          )
        : await postsApi.createPost(values.title!, values.content!);

      if (response.data) {
        navigate({ to: "/posts/$id", params: { id: response.data.id } });
      } else {
        setError(
          response.error ||
            `Failed to ${initialPost ? "update" : "create"} post`
        );
      }
    } catch (err) {
      setError(
        `An error occurred while ${initialPost ? "updating" : "creating"} the post`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{initialPost ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={getDefaultValues(initialPost)}
          >
            <div className="space-y-6">
              {error && <FormError error={error} />}

              <FormInput
                type="text"
                name="title"
                placeholder="Enter post title"
                label="Title"
              />

              <FormInput
                type="textarea"
                name="content"
                placeholder="Write your post content here..."
                label="Content"
                className="min-h-[200px] resize-vertical"
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onCancel ? onCancel() : navigate({ to: "/" })
                  }
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting
                    ? initialPost
                      ? "Saving Changes..."
                      : "Creating Post..."
                    : initialPost
                      ? "Save Changes"
                      : "Create Post"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
