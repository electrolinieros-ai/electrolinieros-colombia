import { createFileRoute } from "@tanstack/react-router";

import { VehiclesPage } from "../../components/pages/VehiclesPage";

export const Route = createFileRoute("/vehiculos/")({
  component: VehiclesPage,
});
