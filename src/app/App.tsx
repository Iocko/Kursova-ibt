import { useAuth } from "@/contexts/AuthContext";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

const router = createRouter({ routeTree, context: { auth: undefined! } }); // this is according to tanstack docs https://tanstack.com/router/v1/docs/framework/react/guide/router-context

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
