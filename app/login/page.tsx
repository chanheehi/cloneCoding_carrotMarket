"use client";

import FormButton from "@/components/btn";
import Input from "@/components/input";
import SocailLogin from "@/components/social-login";
import { useActionState } from "react";
import { login } from "./actions";

const initialState = {
  token: false,
}

export default function Login() {

  const [state, trigger] = useActionState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action={trigger} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email} 
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password} 
        />
        <FormButton text="Login" />
      </form>
      <SocailLogin />
    </div>
  );
}