import { render } from "@testing-library/react";
import {
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";

import { createAppRouter } from "../lib/router";

export function renderApp(initialPath = "/") {
  const router = createAppRouter(
    createMemoryHistory({ initialEntries: [initialPath] }),
  );

  const utils = render(<RouterProvider router={router} />);

  return { router, ...utils };
}