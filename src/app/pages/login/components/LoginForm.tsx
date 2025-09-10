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

const schema = z.object({
  email: requiredString.email("Please enter a valid email"),
  password: requiredString,
});

type LoginFormData = z.infer<typeof schema> & { id: string };

const defaultValues: LoginFormData = {
  id: "",
  email: "",
  password: "",
};

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (values: Partial<LoginFormData>) => {
    if (!values.email || !values.password) return;

    setError("");
    const result = await login(values.email, values.password);

    if (result.success) {
      navigate({ to: "/" });
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
