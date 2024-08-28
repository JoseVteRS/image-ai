import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInCard } from "@/features/auth/components/sign-in-card";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return <SignInCard />;
}
