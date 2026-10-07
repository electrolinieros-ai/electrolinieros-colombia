import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/vehiculos/$slug/productos/$productId",
)({
  component: () => <Outlet />,
});