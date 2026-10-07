import { useNavigate } from "@tanstack/react-router";

import { trackEvent } from "../lib/analytics";

type UseProductInterestParams = {
  slug: string;
};

type UseProductInterestResult = {
  goToInterest: (productId: string) => Promise<void>;
};

export function useProductInterest({
  slug,
}: UseProductInterestParams): UseProductInterestResult {
  const navigate = useNavigate();

  const goToInterest = async (productId: string) => {
    if (!productId) {
      console.warn("No se recibió un productId válido.");
      return;
    }

    void trackEvent("price_requested", productId);

    await navigate({
      to: "/vehiculos/$slug/productos/$productId/interes",
      params: {
        slug,
        productId,
      },
    });
  };

  return {
    goToInterest,
  };
}
