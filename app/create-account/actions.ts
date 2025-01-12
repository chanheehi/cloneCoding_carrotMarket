"use server";
import { z } from "zod";
import { PASSWORD_REGEX } from "@/lib/constants";


function checkUsername(username: string) {
  return !username.includes("potato");
}

const checkPasswords = ({password,
  confirm_password} : {password: string,
  confirm_password:string}) => password === confirm_password

const FormSchema = z.object({
  username: z.string().min(3, "유저명이 너무 짧아요").max(10, "유저명이 너무 길어요").refine(checkUsername, "No potatoes allowed!"),
  email: z.string().email().toLowerCase(),
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

  
  const result = FormSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data)
  }
}