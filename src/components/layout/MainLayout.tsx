import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-6 overflow-auto">
          <ErrorBoundary
            fallback={<div className="text-red-500">Error!!!</div>}
          >
            {children}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
