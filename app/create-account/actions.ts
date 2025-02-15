"use server";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;


const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "No potatoes allowed!"),
    email: z
      .string()
      .email()
      .toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ( data , ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
      },
    })
    // 유저가 이미 존재하면 오류 출력
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 이름입니다",
        path: ["username"],
        fatal: true,
      })
    }
    return z.NEVER;
  })
  .superRefine(async ( data , ctx) => {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    })
    // 유저가 이미 존재하면 오류 출력
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 이메일입니다",
        path: ["email"],
        fatal: true,
      })
    }
    return z.NEVER;
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}