import { z } from "zod";

export const requiredString = z.string().min(1, {
  message: "This field is required",
});
export const requiredNumber = z.number().min(1, {
  message: "This field is required",
});
