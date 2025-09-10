import { ReactElement, useCallback, useMemo } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, z } from "zod";

import { ShadcnForm } from "../ui";

import { getDefaultValuesFromScheme } from "./utils";
import { BaseModel } from "@/types/baseModel";

type FormSchema<T> = Schema<Partial<T>>;

export interface FormProps<T extends BaseModel> {
  schema: FormSchema<T>;
  defaultValues?: DefaultValues<Partial<T>>;
  onSubmit: (values: z.infer<FormSchema<T>>) => void;
  children: ReactElement;
  className?: string;
}

export function Form<T extends BaseModel>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const _defaultValues = useMemo(
    () => getDefaultValuesFromScheme<T>(schema),
    [schema]
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ..._defaultValues, ...defaultValues },
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof schema>) => {
      onSubmit(values);
      form.reset();
    },
    [onSubmit, form]
  );
  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children}
      </form>
    </ShadcnForm>
  );
}
