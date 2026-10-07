import { createFileRoute } from "@tanstack/react-router";

import { InterestPage } from "../../../../../components/pages/InterestPage";

export const Route = createFileRoute(
  "/vehiculos/$slug/productos/$productId/interes",
)({
  component: InterestPage,
});