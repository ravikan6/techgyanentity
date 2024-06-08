'use client'
import { useSession } from "next-auth/react";


export default function Home() {
  const session = useSession();

  return (
    <>
      <h1>Home</h1>
      <h2 className="text-lg">
        {session?.user?.password}
      </h2>
    </>
  );
}
