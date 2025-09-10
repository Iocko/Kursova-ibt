import { MainLayout } from "@/components/layout/MainLayout";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  validateSearch: () => ({}),
  beforeLoad: ({ context }) => {
    const { isAuthenticated, isLoading } = context.auth;

    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        params: (p) => p,
        search: (s) => s,
      });
    }
  },
});

function AuthenticatedLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
