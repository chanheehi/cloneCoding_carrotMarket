/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";
import { z } from "zod";
import { PASSWORD_REGEX } from "@/lib/constants";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const db = new PrismaClient();

const check_UniqueUserName = async (username: string) => {
  const findUser = await db.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
    }
  })

  // 유저 이름이 이미 존재하는지 확인한 값을 반환
  return !Boolean(findUser)
}

const checkPasswords = ({password,
  confirm_password} : {password: string,
  confirm_password:string
}) => password === confirm_password

const check_UniqueEmail = async (email: string) => {
  const find_UserEmail = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })

  return !Boolean(find_UserEmail)
}

const FormSchema = z.object({
  username: z.string().trim().min(3, "유저명이 너무 짧아요").max(10, "유저명이 너무 길어요").refine(check_UniqueUserName, "이미 존재하는 이름이에요"),
  email: z.string().email().toLowerCase().refine(check_UniqueEmail, "이미 존재하는 이메일이에요"),
  password: z.string().min(10).regex(PASSWORD_REGEX, "영어 대문자와 소문자가 한글자 이상 포함되어야합니다."),
  confirm_password: z.string().min(10),
}).refine(checkPasswords, {
  message: "비밀번호가 서로 달라요",
  path: ["confirm_password"],
})

export async function createAccount(prevState: unknown, formData: FormData){
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await FormSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten()
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
    })

    console.log(process.env.COOKIES_PASSWORD)
    // @ts-ignore
    const cookie = await getIronSession(cookies(), {
      cookieName: "delicious-karrot",
      password: process.env.COOKIES_PASSWORD,
    })
    // @ts-ignore
    cookie.id = user.id
    await cookie.save()

    redirect("/profile")

  }
}