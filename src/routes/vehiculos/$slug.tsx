import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/vehiculos/$slug")({
  component: () => <Outlet />,
});