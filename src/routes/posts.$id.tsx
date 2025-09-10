import { PostDetail } from "@/app/pages/posts/[id]/PostDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PostDetail />;
}
