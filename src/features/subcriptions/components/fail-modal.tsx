"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useCheckout } from "../api/use-checkout";
import { useFailModal } from "../store/use-fail-modal";

export const FailModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useFailModal();
  const mutation = useCheckout();

  const handleClose = () => {
    router.replace("/");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex items-center gap-y-4">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <DialogTitle className="text-center">
            Somethingn went wrong
          </DialogTitle>
          <DialogDescription className="text-center">
            We could not process your payment. Please try again later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2 mt-4 gap-y-2">
          <Button
            className="w-full"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
