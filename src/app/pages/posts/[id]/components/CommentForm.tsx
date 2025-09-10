import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/form/Form";
import { FormInput } from "@/components/form/FormInput";
import { FormError } from "@/components/form/FormError";
import { requiredString } from "@/utils";

const schema = z.object({
  id: z.string().optional(),
  content: requiredString.min(3, "Comment must be at least 3 characters"),
});

type CommentFormData = z.infer<typeof schema>;

const getDefaultValues = (initialContent: string): CommentFormData => ({
  id: "",
  content: initialContent,
});

interface CommentFormProps {
  onCommentSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  onCancel?: () => void;
}

export function CommentForm({
  onCommentSubmit,
  initialContent = "",
  onCancel,
}: CommentFormProps) {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: Partial<CommentFormData>) => {
    if (!values.content) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onCommentSubmit(values.content);
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {initialContent ? "Edit Comment" : "Add a Comment"}
      </h3>
      <Form
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={getDefaultValues(initialContent)}
      >
        <div className="space-y-4">
          {error && <FormError error={error} />}

          <FormInput
            type="textarea"
            name="content"
            placeholder="Write your comment here..."
            className="min-h-[100px] resize-y"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
