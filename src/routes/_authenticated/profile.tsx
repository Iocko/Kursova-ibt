import { Profile } from "@/app/pages/profile/Profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Profile />;
}
