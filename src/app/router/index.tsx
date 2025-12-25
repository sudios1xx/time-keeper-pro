import { createBrowserRouter } from "react-router-dom";
import AppRoutes from "./app-routes";

const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <AppRoutes />,
    },
  ],
);

export default router;
export { router };



