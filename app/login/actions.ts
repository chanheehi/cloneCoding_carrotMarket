"use server";

// import { redirect } from "next/navigation";
import { z } from "zod";
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR } from "@/lib/constants";

const FormSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string({required_error: "Password is require"}).min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})

export async function login(prevState: unknown, formData: FormData) {
  console.log(prevState, formData)
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }
  const result = FormSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data)
  }
};