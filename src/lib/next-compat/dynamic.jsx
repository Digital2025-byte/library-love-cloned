import { lazy, Suspense } from "react";

export default function dynamic(importer, options = {}) {
  const LazyComponent = lazy(() =>
    Promise.resolve(importer()).then((mod) => ({
      default: mod?.default ?? mod,
    }))
  );

  const Loading = options.loading;

  function DynamicComponent(props) {
    return (
      <Suspense fallback={Loading ? <Loading /> : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }

  return DynamicComponent;
}
