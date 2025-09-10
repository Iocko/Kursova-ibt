import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/form/Form";
import { FormInput } from "@/components/form/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import { requiredString } from "@/utils";
import { z } from "zod";
import { FormError } from "@/components/form/FormError";
import { useNavigate } from "@tanstack/react-router";

const schema = z
  .object({
    email: requiredString.email("Please enter a valid email"),
    name: requiredString,
    password: requiredString.min(6, "Password must be at least 6 characters"),
    passwordConfirm: requiredString,
  })
  // Ensure matching passwords
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof schema> & { id: string };

const defaultValues: RegisterFormData = {
  id: "",
  email: "",
  name: "",
  password: "",
  passwordConfirm: "",
};

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (values: Partial<RegisterFormData>) => {
    if (!values.email || !values.password || !values.name) return;

    setError("");
    const result = await register(values.email, values.password, values.name);

    if (result.success) {
      navigate({ to: "/" });
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          >
            <div className="space-y-6">
              {error && <FormError error={error} />}

              <FormInput
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <FormInput
                type="text"
                name="name"
                label="Name"
                placeholder="Enter your name"
              />
              <FormInput
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <FormInput
                type="password"
                name="passwordConfirm"
                label="Confirm Password"
                placeholder="Confirm your password"
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
