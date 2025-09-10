import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/form/Form";
import { FormInput } from "@/components/form/FormInput";
import { FormError } from "@/components/form/FormError";

const schema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Check if trying to change anything
    const isChangingName = data.name !== undefined;
    const isChangingPassword = data.currentPassword || data.newPassword;

    if (!isChangingName && !isChangingPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please update at least one field",
        path: ["name"],
      });
      return;
    }

    // Password validation - only if trying to change password
    if (isChangingPassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required to change password",
          path: ["currentPassword"],
        });
      }
      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password is required",
          path: ["newPassword"],
        });
      }
      if (data.currentPassword === data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password must be different from current password",
          path: ["newPassword"],
        });
      }
    }
  });

type ProfileFormData = z.infer<typeof schema>;

interface ProfileFormProps {
  defaultValues: {
    id: string;
    name: string;
  };
  onSubmit: (values: Partial<ProfileFormData>) => Promise<void>;
}

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: Partial<ProfileFormData>) => {
    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(values);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form schema={schema} onSubmit={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {error && <FormError error={error} />}

        <FormInput
          type="text"
          name="name"
          label="Name"
          placeholder="Enter your name"
        />

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-4">Change Password</h4>

          <FormInput
            type="password"
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
          />

          <FormInput
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Form>
  );
}
