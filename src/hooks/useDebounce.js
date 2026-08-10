import { useState, useEffect } from "react";

/**
 * useDebounce hook
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=400] - Debounce delay in milliseconds
 * @returns {*} - The debounced value
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
