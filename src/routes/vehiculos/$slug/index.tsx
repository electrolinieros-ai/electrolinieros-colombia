import { createFileRoute } from "@tanstack/react-router";

import { VehiclePage } from "../../../components/pages/VehiclePage";

export const Route = createFileRoute("/vehiculos/$slug/")({
  component: VehiclePage,
});