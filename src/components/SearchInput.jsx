import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Reusable SearchInput Component
 *
 * Manages local typing state for snappy responsiveness, while returning
 * the debounced value to the parent component via `onSearch` or `onChange`.
 */
const SearchInput = ({
  value,
  defaultValue = "",
  onSearch,
  onChange,
  delay = 350,
  placeholder = "Search records…",
  className = "",
  inputClassName = "",
  id = "search-input",
  disabled = false,
  autoFocus = false,
}) => {
  const isControlled = value !== undefined;
  const [searchTerm, setSearchTerm] = useState(
    isControlled ? value : defaultValue,
  );
  const [prevControlledValue, setPrevControlledValue] = useState(value);

  // Sync external controlled value during rendering without an effect
  if (isControlled && value !== prevControlledValue) {
    setPrevControlledValue(value);
    setSearchTerm(value);
  }

  const debouncedTerm = useDebounce(searchTerm, delay);
  const inputRef = useRef(null);
  const isInitialMount = useRef(true);
  const prevDebouncedTerm = useRef(debouncedTerm);

  const callbackRef = useRef(onSearch || onChange);
  useEffect(() => {
    callbackRef.current = onSearch || onChange;
  });

  // Trigger callback only when debounced term actually changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prevDebouncedTerm.current === debouncedTerm) {
      return;
    }

    prevDebouncedTerm.current = debouncedTerm;
    callbackRef.current?.(debouncedTerm);
  }, [debouncedTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    prevDebouncedTerm.current = "";
    callbackRef.current?.("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      prevDebouncedTerm.current = searchTerm;
      callbackRef.current?.(searchTerm);
    } else if (e.key === "Escape" && searchTerm) {
      handleClear();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search Icon */}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-colors peer-focus:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Input */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="searchbox"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`peer w-full bg-[#0f172a] border border-[#1e293b] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />

      {/* Clear Button */}
      {searchTerm && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
