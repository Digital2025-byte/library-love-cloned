import {
  useLocation,
  useNavigate,
  useParams as useRouterParams,
} from "react-router-dom";

export function useParams() {
  return useRouterParams();
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const { search } = useLocation();
  return [new URLSearchParams(search)];
}

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (href) => navigate(href),
    replace: (href) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
  };
}
