import { useState, useEffect } from "react";

// Custom hook for debouncing a value
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Create a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if the value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect when value or delay changes

  return debouncedValue;
}
