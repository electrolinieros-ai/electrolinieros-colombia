import { createFileRoute } from "@tanstack/react-router";

import { ProductPage } from "../../../../../components/pages/ProductPage";

export const Route = createFileRoute(
  "/vehiculos/$slug/productos/$productId/",
)({
  component: ProductPage,
});