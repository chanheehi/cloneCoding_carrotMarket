import Link from "next/link";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";


export default function SocailLogin() {
  return (
  <>
    <div className="w-full h-px bg-neutral-500" />
      <div className="flex flex-col gap-3">
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/login/sms"
        >
        <span>
          <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
        </span>
        <span>Continue with Phone number</span>
      </Link>
      
      <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/login/github"
        >
        <span>
          <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
        </span>
        <span>Continue with Github</span>
      </Link>
    </div>
  </>
  )
}
