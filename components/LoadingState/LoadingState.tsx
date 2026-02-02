import { Spinner } from "@/components/ui/Spinner";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading meals..." }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
