"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Crown, Home, MessageCircleQuestion } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { usePaywall } from "@/features/subcriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subcriptions/api/use-checkout";
import { useBilling } from "@/features/subcriptions/api/use-billing";

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const mutation = useCheckout();
  const billingMutation = useBilling();
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    billingMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && !isLoading && (
        <div className="px-3">
          <Button
            onClick={() => mutation.mutate()}
            className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition-opacity"
            variant="outline"
            disabled={mutation.isPending}
          >
            <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
            Upgrade to Pro
          </Button>
        </div>
      )}
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          label="Home"
          icon={Home}
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          label="Billing"
          icon={CreditCard}
          onClick={onClick}
        />
        <SidebarItem
          href="mailto:jvrs.90@gmail.com"
          label="Get Help"
          icon={MessageCircleQuestion}
        />
      </ul>
    </div>
  );
};
