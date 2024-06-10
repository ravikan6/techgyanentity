import { auth } from "@/lib/auth";
import { Header } from "@/components/header";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <h1>Home</h1>
      <h2 className="text-lg">
        {session?.user?.password}
      </h2>
    </>
  );
}
