import { useState, useEffect, useCallback } from "react";
import { eventBus } from "@/framework/runtime/event-bus";

/**
 * Query Runtime Adapter
 * 
 * Section 18 of LLD: "Centralized async orchestration runtime."
 * Section 6 of LLD: "Applications NEVER consume infrastructure libraries directly."
 */

export interface QueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
}

export function useQueryRuntime<T = unknown>({ queryKey, queryFn, enabled = true }: QueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [enabled, fetch]);

  // Section 18: "subscriber notification"
  useEffect(() => {
    const key = queryKey.join(".");
    return eventBus.on(`query.invalidate.${key}`, () => {
      fetch();
    });
  }, [queryKey, fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useMutationRuntime<T = unknown, V = unknown>(mutationFn: (variables: V) => Promise<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: V) => {
    setIsLoading(true);
    try {
      const result = await mutationFn(variables);
      
      // Section 18: "Entity resolved -> cache invalidated"
      // In a real app, we'd emit an event here based on the result
      eventBus.emit("mutation.success", { result, variables });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}
