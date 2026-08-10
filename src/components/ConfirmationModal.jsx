import Modal from "./Modal";

/**
 * Reusable Confirmation Dialog Modal Component
 *
 * @param {object} props
 * @param {boolean} [props.isOpen=true] - Whether modal is visible
 * @param {function} props.onClose - Close callback
 * @param {function} props.onAccept - Accept / Confirm action callback
 * @param {function} [props.onCancel] - Optional cancel callback (defaults to onClose)
 * @param {string} [props.title="Confirm Action"] - Dialog title
 * @param {string|React.ReactNode} [props.description] - Description text or element
 * @param {React.ReactNode} [props.children] - Optional custom content between description and buttons
 * @param {boolean} [props.isLoading=false] - Loading indicator on confirm button
 * @param {string} [props.acceptLabel="Confirm"] - Label for accept button
 * @param {string} [props.cancelLabel="Cancel"] - Label for cancel button
 * @param {string} [props.acceptColor] - Direct Tailwind color class for accept button e.g. "bg-red-600"
 * @param {string} [props.variant="danger"] - "danger" | "warning" | "primary" | "success"
 * @param {string} [props.size="md"] - Modal width size: "sm" | "md" | "lg"
 */
const ConfirmationModal = ({
  isOpen = true,
  onClose,
  onAccept,
  onCancel,
  title = "Confirm Action",
  description,
  children,
  isLoading = false,
  acceptLabel = "Confirm",
  cancelLabel = "Cancel",
  acceptColor,
  variant = "danger",
  size = "md",
}) => {
  const handleCancel = () => {
    if (isLoading) return;
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleAccept = () => {
    if (isLoading) return;
    onAccept?.();
  };

  // Resolve color based on variant or acceptColor prop
  const variantStyles = {
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20",
    warning: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20",
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20",
  };

  const buttonColorClass = acceptColor || variantStyles[variant] || variantStyles.danger;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      size={size}
    >
      <div className="space-y-5">
        {/* Optional custom child content (e.g. user card) */}
        {children}

        {/* Description */}
        {description && (
          <div className="text-sm text-gray-300 leading-relaxed">
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            id="confirm-modal-accept"
            onClick={handleAccept}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${buttonColorClass}`}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {acceptLabel}
          </button>
          <button
            type="button"
            id="confirm-modal-cancel"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f2937] hover:bg-[#374151] disabled:opacity-60 disabled:cursor-not-allowed text-gray-200 text-sm font-semibold transition-colors border border-transparent hover:border-[#374151]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
