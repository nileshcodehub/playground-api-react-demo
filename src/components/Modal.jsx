import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalStack = [];

/**
 * Reusable Modal component using React Portals.
 */
const Modal = ({
  isOpen = true,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
  containerClassName = "",
  leftIcon,
  leftIconClassName = "",
}) => {
  const modalIdRef = useRef(Symbol("modal"));

  // Handle Escape key to close (stack-aware)
  useEffect(() => {
    if (!isOpen) return;
    const modalId = modalIdRef.current;

    modalStack.push(modalId);

    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      const topModal = modalStack[modalStack.length - 1];

      if (topModal === modalId) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      const index = modalStack.indexOf(modalId);

      if (index > -1) {
        modalStack.splice(index, 1);
      }

      if (modalStack.length === 0) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    full: "max-w-[95vw]",
  };

  const modalContent = (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full bg-[#0f172a] rounded-2xl shadow-2xl border border-[#1e293b] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300 ${
          sizeStyles[size] || sizeStyles.md
        } ${containerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors absolute right-4 top-4 z-10 opacity-75 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
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

        {/* Modal Header */}
        {title && (
          <div className="px-6 py-4 border-b border-[#1e293b] pr-12 shrink-0">
            <div className="flex items-center gap-2.5">
              {leftIcon && (
                <span className={`shrink-0 ${leftIconClassName}`}>
                  {leftIcon}
                </span>
              )}
              <h2 className="text-base font-bold text-white tracking-tight">
                {title}
              </h2>
            </div>
            {description && (
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div
          id="modal-scroll-body"
          className="p-6 overflow-y-auto overscroll-contain flex-1"
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
