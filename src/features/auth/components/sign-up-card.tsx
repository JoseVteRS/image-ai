"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useSignUp } from "../hooks/use-sign-up";
import { TriangleAlert } from "lucide-react";

export const SignUpCard = () => {
  const mutation = useSignUp();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onCredentialsSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          });
        },
      }
    );
  };

  const onProviderSignUp = (provider: "github" | "google") => {
    signIn(provider, {
      callbackUrl: "/",
    });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Register to enjoy the full experience</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!mutation.error &&(
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>Something went wrong</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialsSignUp} className="space-y-2.5">
          <Input
            disabled={mutation.isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            minLength={3}
            required
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </form>
        <div className="flex flex-col space-y-2.5">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("google")}
          >
            <FcGoogle className="mr-2 size-5 top-1/2 -translate-y-1/2 left-2.5 absolute" />
            <span>Continue with Google</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("github")}
          >
            <FaGithub className="mr-2 size-5 top-1/2 -translate-y-1/2 left-2.5 absolute" />
            <span>Continue with Github</span>
          </Button>

          <p className="text-xs text-muted-foreground">
            Already have an account?
            <Link href="/sign-in">
              <span className="text-sky-700 hover:underline">Sign in</span>
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
