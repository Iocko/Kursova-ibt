import { useLocation, useNavigate } from "@tanstack/react-router";

export function RemoveTrailingSlash() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  if (pathname.match("/.*/$")) {
    navigate({
      search,
      to: pathname.replace(/\/+$/, ""),
      replace: true,
    });
  }

  return null;
}
