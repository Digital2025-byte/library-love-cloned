import {
  useLocation,
  useNavigate,
  useParams as useRouterParams,
} from "@tanstack/react-router";

export function useParams() {
  return useRouterParams({ strict: false });
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const { searchStr } = useLocation();
  return [new URLSearchParams(searchStr || "")];
}

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (href) => navigate({ to: href }),
    replace: (href) => navigate({ to: href, replace: true }),
    back: () => window.history.back(),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.searchStr || "")),
  };
}
