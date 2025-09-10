import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 px-4 flex items-center">
      <div className="flex items-center space-x-2 md:space-x-6">
        <span className="font-bold text-lg">Blog</span>
        <div className="flex items-center space-x-2 md:space-x-6 text-sm font-medium">
          <button
            onClick={() => navigate({ to: "/" })}
            className="transition-colors hover:text-foreground/80 cursor-pointer"
          >
            Home
          </button>
          {isAuthenticated && (
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="transition-colors hover:text-foreground/80 cursor-pointer"
            >
              Profile
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              <span className="hidden md:block">Welcome, {user?.name}</span>
              <span className="block md:hidden">{user?.name}</span>
            </span>
            <Button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Button
              onClick={() => navigate({ to: "/login" })}
              variant="ghost"
              size="sm"
            >
              Login
            </Button>
            <Button onClick={() => navigate({ to: "/register" })} size="sm">
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
