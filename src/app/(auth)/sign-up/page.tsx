import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export default async function SignUpPage() {
  const session = await auth();
  //   if (!session) {
  //     redirect("/");
  //   }
  return <SignUpCard />;
}
