import { InputHTMLAttributes } from "react";

interface FormInputProps {
  errors?: string[];
}

export default function Input({name, errors = [], ...rest}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-2 ring-neutral-200 focus:ring-orange-500 transition border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors?.map((error, index) =>(
        <span key={index} className="text-red-500 font-medium">
        {error}</span>
      ))}
      
    </div>
  )
}