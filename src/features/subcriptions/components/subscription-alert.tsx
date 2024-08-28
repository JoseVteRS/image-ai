"use client";
import { useSearchParams } from "next/navigation";
import { useFailModal } from "../store/use-fail-modal";
import { useEffect } from "react";
import { useSuccesModal } from "../store/use-success-modal";

export const SubscriptionAlert = () => {
  const params = useSearchParams();
  const { onOpen: onOpenFail } = useFailModal();
  const { onOpen: onOpenSuccess } = useSuccesModal();

  const canceled = params.get("canceled");
  const success = params.get("success");

  useEffect(() => {
    if (canceled) {
      onOpenFail();
    }

    if (success) {
      onOpenSuccess();
    }
  }, [canceled, onOpenFail, success, onOpenSuccess]);

  return null;
};
