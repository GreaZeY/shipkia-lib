import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { getAppRoutes, setAppSidebarItems } from "@/framework/boot";
import { resolve } from "@/framework/registry";

// App Layout
const AppLayout = resolve(
  "layout:AppLayout",
  lazy(() => import("@/components/layout/AppLayout")),
);

// Core App Views
const DashboardView = lazy(() => import("@/views/shipping/DashboardView"));
const OrdersView = lazy(() => import("@/views/shipping/OrdersView"));
const ShipmentsView = lazy(() => import("@/views/shipping/ShipmentsView"));
const ProductsView = lazy(() => import("@/views/shipping/ProductsView"));

// Dynamic DocType (Frappe pattern fallback)
const { ListViewPage, FormViewPage } = await import("@/views/DocTypePage").then(
  (m) => m.default,
);

// Build dynamic routes from installed apps
const appRoutes = getAppRoutes().map((route) => ({
  path: route.path,
  element: (
    <Suspense
      fallback={
        <div className="p-4 text-sm text-muted-foreground">
          Loading module...
        </div>
      }
    >
      <route.component />
    </Suspense>
  ),
}));

// Initialize the Shipping App Sidebar Items
setAppSidebarItems([
  { label: "Dashboard", icon: "layout-grid", route: "/dashboard" },
  { label: "Orders", icon: "package", route: "/orders" },
  { label: "ndr", icon: "truck", route: "/ndr" },
  { label: "Products", icon: "layers", route: "/products" },
]);

// Exclude docs routes completely from production build chunks
const devRoutes = import.meta.env.DEV
  ? [
      {
        path: "docs",
        children: [
          {
            path: "",
            element: <Navigate to="intro" replace />,
          },
          {
            path: "intro",
            element: (
              <Suspense fallback={null}>
                {(() => {
                  const IntroDocs = lazy(
                    () => import("@/views/components/IntroDocs"),
                  );
                  return <IntroDocs />;
                })()}
              </Suspense>
            ),
          },
          {
            path: "theme-palette",
            element: (
              <Suspense fallback={null}>
                {(() => {
                  const ThemePalette = lazy(
                    () => import("@/pages/ThemePalette"),
                  );
                  return <ThemePalette />;
                })()}
              </Suspense>
            ),
          },
          {
            path: ":componentName",
            element: (
              <Suspense fallback={null}>
                {(() => {
                  const AutoDocs = lazy(
                    () => import("@/views/components/AutoDocs"),
                  );
                  return <AutoDocs />;
                })()}
              </Suspense>
            ),
          },
        ],
      },
    ]
  : [];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Core Shipping App Routes
      {
        path: "dashboard",
        element: (
          <Suspense fallback={null}>
            <DashboardView />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={null}>
            <OrdersView />
          </Suspense>
        ),
      },
      {
        path: "ndr",
        element: (
          <Suspense fallback={null}>
            <ShipmentsView />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={null}>
            <ProductsView />
          </Suspense>
        ),
      },

      // Component Documentation (Dev Only)
      ...devRoutes,

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
    element: <Navigate to="/dashboard" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
