import { NewPost } from "@/app/pages/posts/new/NewPost";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/posts/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewPost />;
}
