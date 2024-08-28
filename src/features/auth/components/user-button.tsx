"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useBilling } from "@/features/subcriptions/api/use-billing";
import { usePaywall } from "@/features/subcriptions/hooks/use-paywall";
import { CreditCard, Crown, Loader2, LogOut, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const UserButton = () => {
  const { shouldBlock, triggerPaywall, isLoading } = usePaywall();
  const session = useSession();
  const mutation = useBilling();

  if (session.status === "loading") {
    return <Loader2 className="size-4 text-muted-foreground animate-spin" />;
  }

  if (session.status === "unauthenticated" || !session.data) {
    return null;
  }

  const name = session.data?.user?.name;
  const imageUrl = session.data?.user?.image;

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    mutation.mutate();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        {!shouldBlock && !isLoading && (
          <div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
            <div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
              <Crown className="size-3 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        )}
        <Avatar className="size-10 hover:opacity-75 transition-opacity">
          <AvatarImage src={imageUrl || ""} alt={name || ""} />
          <AvatarFallback className="bg-blue-500 font-medium text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem disabled={mutation.isPending} onClick={onClick} className="h-10">
          <CreditCard className="size-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          disabled={false}
          onClick={() => signOut()}
          className="h-10"
        >
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
