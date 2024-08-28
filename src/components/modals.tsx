"use client";

import { FailModal } from "@/features/subcriptions/components/fail-modal";
import { SubscriptionModal } from "@/features/subcriptions/components/subscription-modal";
import { SuccessModal } from "@/features/subcriptions/components/success-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SubscriptionModal />
      <FailModal />
      <SuccessModal />
    </>
  );
};
