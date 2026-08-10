import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Reusable SearchInput Component
 *
 * Manages local typing state for snappy responsiveness, while returning
 * the debounced value to the parent component via `onSearch` or `onChange`.
 *
 * @param {object} props
 * @param {string} [props.value] - Controlled search term value (optional)
 * @param {string} [props.defaultValue=""] - Default initial search term
 * @param {function} props.onSearch - Callback invoked with the debounced search term: (term: string) => void
 * @param {function} [props.onChange] - Alias for onSearch
 * @param {number} [props.delay=400] - Debounce delay in milliseconds
 * @param {string} [props.placeholder="Search..."] - Input placeholder text
 * @param {string} [props.className=""] - Wrapper container class
 * @param {string} [props.inputClassName=""] - Input element class
 * @param {string} [props.id="search-input"] - Input element id
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.autoFocus=false] - Whether input should autofocus
 */
const SearchInput = ({
  value,
  defaultValue = "",
  onSearch,
  onChange,
  delay = 400,
  placeholder = "Search...",
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

  // Trigger callback when debounced term updates
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const callback = onSearch || onChange;
    callback?.(debouncedTerm);
  }, [debouncedTerm, onSearch, onChange]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    const callback = onSearch || onChange;
    callback?.("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Immediate submission on Enter
      const callback = onSearch || onChange;
      callback?.(searchTerm);
    } else if (e.key === "Escape" && searchTerm) {
      handleClear();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search Icon */}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-colors peer-focus:text-indigo-400"
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
        className={`peer w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />

      {/* Clear Button */}
      {searchTerm && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#1f2937] transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
