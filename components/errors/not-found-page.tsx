import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty";

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-dvh flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
