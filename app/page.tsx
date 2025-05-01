import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Link href={'/sign-in'} className="hover:cursor-pointer">Sign In</Link>
    </div>
  )
}
