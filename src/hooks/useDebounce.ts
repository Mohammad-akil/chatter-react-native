import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value.
 * @template T - The type of the value to be debounced.
 * @param {T} value - The value to be debounced.
 * @param {number} [delay] - The delay in milliseconds for debouncing. Defaults to 500 milliseconds.
 * @returns {T} The debounced value.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-debounce)
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
