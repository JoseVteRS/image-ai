import { useSubscriptionModal } from "@/features/subcriptions/store/use-subcription-modal";
import { useGetSubscription } from "../api/use-get-subscription";

export const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();

  const shouldBlock = isLoadingSubscription || !subscription?.active;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    },
  };
};
