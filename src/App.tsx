import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { getAppRoutes } from "@/framework/boot";
import { resolve } from "@/framework/registry";

// Framework default views (lazy — tree-shaken if overridden).
// Safe to call resolve() here because this module is dynamically imported
// AFTER bootFramework() completes in main.tsx.
const ThemePalette = lazy(() => import("@/pages/ThemePalette"));
const AppLayout = resolve(
  "layout:AppLayout",
  lazy(() => import("@/components/layout/AppLayout")),
);
const IntroDocs = resolve(
  "view:intro",
  lazy(() => import("@/views/components/IntroDocs")),
);
const AutoDocs = resolve(
  "view:autodocs",
  lazy(() => import("@/views/components/AutoDocs")),
);
const { ListViewPage, FormViewPage } = await import("@/views/DocTypePage");

// Build dynamic routes from installed apps
const appRoutes = getAppRoutes().map((route) => ({
  path: route.path,
  element: (
    <Suspense>
      <route.component />
    </Suspense>
  ),
}));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/docs/intro" replace />,
  },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Framework routes
      {
        path: "docs",
        children: [
          {
            path: "",
            element: <Navigate to="intro" replace />,
          },
          {
            path: "intro",
            element: <IntroDocs />,
          },
          {
            path: "theme-palette",
            element: <ThemePalette />,
          },
          {
            path: ":componentName",
            element: <AutoDocs />,
          },
        ],
      },

      // App-contributed routes (rendered inside the same layout)
      ...appRoutes,

      // Dynamic DocType Routes (Frappe-like pattern)
      {
        path: ":doctype",
        element: <ListViewPage />,
      },
      {
        path: ":doctype/:name",
        element: <FormViewPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/docs/intro" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
