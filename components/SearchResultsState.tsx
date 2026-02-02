interface SearchResultsStateProps {
  count: number;
  isLoading: boolean;
}

export default function SearchResultsState({ count, isLoading }: SearchResultsStateProps) {
  if (isLoading) {
    return (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Loading meals...
      </div>
    );
  }

  const message =
    count === 0 ? "No meals found" : count === 1 ? "1 meal found" : `${count} meals found`;

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
