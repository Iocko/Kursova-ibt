import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { RemoveTrailingSlash } from "@/components/routes/RemoveTrailingSlash";
import { useAuth } from "@/contexts/AuthContext";
import { Fragment } from "react";

type RouteContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      <RemoveTrailingSlash />
    </Fragment>
  );
}
