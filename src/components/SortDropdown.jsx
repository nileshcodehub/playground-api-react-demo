import { useState, useRef, useEffect, useId } from "react";

/**
 * Format string into human-friendly label (e.g. "username" -> "Username", "first_name" -> "First Name")
 */
const formatLabel = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Reusable SortDropdown Component
 *
 * Manages sort field and sort direction (asc/desc) with internal state,
 * while allowing controlled override and notifying parent via onSortChange.
 */
const SortDropdown = ({
  options = [],
  value,
  order,
  onSortChange,
  defaultField = "",
  defaultOrder = "asc",
  placeholder = "Default Sort",
  className = "",
}) => {
  const isControlled = value !== undefined;
  const [internalField, setInternalField] = useState(defaultField);
  const [internalOrder, setInternalOrder] = useState(defaultOrder);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const menuId = useId();

  const currentField = isControlled ? value : internalField;
  const currentOrder = isControlled ? order || "asc" : internalOrder;

  // Normalize options array into [{ value, label }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: formatLabel(opt) };
    }
    return { value: opt.value, label: opt.label || formatLabel(opt.value) };
  });

  const activeOption = normalizedOptions.find(
    (opt) => opt.value === currentField,
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectField = (field) => {
    const nextOrder =
      currentField === field
        ? currentOrder === "asc"
          ? "desc"
          : "asc"
        : "asc";

    if (!isControlled) {
      setInternalField(field);
      setInternalOrder(nextOrder);
    }

    onSortChange?.(field, nextOrder);
    setIsOpen(false);
  };

  const handleToggleOrder = (e) => {
    e.stopPropagation();
    if (!currentField) return;

    const nextOrder = currentOrder === "asc" ? "desc" : "asc";
    if (!isControlled) {
      setInternalOrder(nextOrder);
    }
    onSortChange?.(currentField, nextOrder);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalField("");
      setInternalOrder("asc");
    }
    onSortChange?.("", "asc");
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger Button */}
      <div className="flex items-center">
        <button
          type="button"
          id="sort-dropdown-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={menuId}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
            currentField
              ? "bg-[#0f172a] text-white border-amber-500/60 shadow-xs shadow-amber-500/10 hover:border-amber-500"
              : "bg-[#0f172a] text-slate-300 border-[#1e293b] hover:border-amber-500/40 hover:text-white"
          }`}
        >
          {/* Sort Icon */}
          <svg
            className={`w-4 h-4 transition-colors ${currentField ? "text-amber-400" : "text-slate-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>

          {/* Label */}
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            Sort:
          </span>
          <span className="text-xs sm:text-sm font-semibold truncate max-w-32.5">
            {activeOption ? activeOption.label : placeholder}
          </span>

          {/* Direction Indicator Badge (when sorted) */}
          {currentField && (
            <button
              type="button"
              onClick={handleToggleOrder}
              title={`Order: ${currentOrder === "asc" ? "Ascending" : "Descending"} (Click to flip)`}
              className="ml-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-colors flex items-center gap-0.5"
            >
              <span>{currentOrder === "asc" ? "ASC" : "DESC"}</span>
              <span className="text-amber-400">
                {currentOrder === "asc" ? "↑" : "↓"}
              </span>
            </button>
          )}

          {/* Chevron */}
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-amber-400" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          id={menuId}
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-2xl shadow-black/80 py-2 z-40 animate-in fade-in zoom-in-95 duration-150 focus:outline-none"
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-[#1e293b] flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sort Fields
            </span>
            {currentField && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] text-slate-400 hover:text-rose-400 font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="py-1 max-h-60 overflow-y-auto">
            {normalizedOptions.map((option) => {
              const isSelected = currentField === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  id={`sort-option-${option.value}`}
                  onClick={() => handleSelectField(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-300 font-semibold"
                      : "text-slate-300 hover:bg-[#1e293b] hover:text-white"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                      {currentOrder === "asc" ? "ASC ↑" : "DESC ↓"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Order Toggle Footer (when a field is active) */}
          {currentField && (
            <div className="px-3 pt-2 pb-1 border-t border-[#1e293b]">
              <div className="flex items-center gap-1.5 bg-[#080e1a] p-1 rounded-xl border border-[#1e293b]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isControlled) setInternalOrder("asc");
                    onSortChange?.(currentField, "asc");
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                    currentOrder === "asc"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Ascending</span>
                  <span>↑</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isControlled) setInternalOrder("desc");
                    onSortChange?.(currentField, "desc");
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                    currentOrder === "desc"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Descending</span>
                  <span>↓</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
