import Link from "next/link";
import "@/lib/db";




export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl ">당근</h1>
        <h2 className="text-2xl">당근 마겟에 어서오세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href="/login"
          className="primary-btn"
        >
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>회원가입이 필요한가요?</span>
          <Link href="/create-account" className="hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}