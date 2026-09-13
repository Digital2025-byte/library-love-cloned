import { lazy, Suspense, useEffect, useState } from "react";

function resolveComponent(mod) {
  let candidate = mod;
  // Unwrap interop layers (e.g. { default: { default: Component } }).
  for (let i = 0; i < 5; i += 1) {
    if (typeof candidate === "function") return candidate;
    if (candidate && typeof candidate === "object") {
      if (candidate.$$typeof) return candidate;
      if ("default" in candidate) {
        candidate = candidate.default;
        continue;
      }
    }
    break;
  }
  return candidate;
}

export default function dynamic(importer, options = {}) {
  const LazyComponent = lazy(() =>
    Promise.resolve(importer()).then((mod) => ({
      default: resolveComponent(mod),
    }))
  );

  const Loading = options.loading;
  const clientOnly = options.ssr === false;

  function DynamicComponent(props) {
    const [mounted, setMounted] = useState(!clientOnly);

    useEffect(() => {
      if (clientOnly) setMounted(true);
    }, []);

    const fallback = Loading ? <Loading /> : null;

    if (!mounted) return fallback;

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }

  return DynamicComponent;
}
