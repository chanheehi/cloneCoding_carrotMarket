"use server";

// import { redirect } from "next/navigation";
import { z } from "zod";
import db from "@/lib/db"
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import bcrypt from "bcrypt"
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
    },
  });
  return Boolean(user)
}
const FormSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, "이메일이 존재하지 않아요"),
  password: z.string({required_error: "Password is require"}).min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})

export async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }
  const result = await FormSchema.safeParseAsync(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true
      }
    })
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx")
    if (ok) {
      const session = await getSession();
      session.id = user!.id
      await session.save();
      redirect("/profile")
    }
    else {
      return {
        fieldErrors: {
          password: ["비밀번호가 틀렸어요"],
          email: []
        }
      }
    }
  }
};