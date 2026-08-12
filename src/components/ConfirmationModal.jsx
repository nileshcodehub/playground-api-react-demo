import Modal from "./Modal";

/**
 * Reusable Confirmation Dialog Modal Component
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
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/20",
    warning: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs shadow-amber-500/20",
    primary: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs shadow-amber-500/20",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/20",
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
          <div className="text-sm text-slate-300 leading-relaxed">
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${buttonColorClass}`}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
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
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-[#283852] disabled:opacity-60 disabled:cursor-not-allowed text-slate-200 text-sm font-semibold transition-colors border border-[#283852] cursor-pointer"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
