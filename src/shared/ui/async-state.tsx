import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const LoadingState = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3" aria-busy="true" aria-live="polite">
    {Array.from({ length: lines }).map((_, idx) => (
      <Skeleton key={idx} className="h-4 w-full" />
    ))}
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="text-sm text-muted-foreground text-center py-6">{message}</div>
);

export const ErrorState = ({ title = "Erro ao carregar", message, onRetry }: ErrorProps) => (
  <Alert variant="destructive" role="alert">
    <AlertTitle>{title}</AlertTitle>
    {message && <AlertDescription className="mt-1">{message}</AlertDescription>}
    {onRetry && (
      <div className="mt-3">
        <Button size="sm" variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    )}
  </Alert>
);



