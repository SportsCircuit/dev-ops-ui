import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Footer slot for action buttons */
  footer?: React.ReactNode;
}

/**
 * Accessible modal dialog with focus trap, Escape key handling,
 * responsive sizing, and ARIA attributes.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);

      // Focus the first focusable element inside modal
      requestAnimationFrame(() => {
        if (modalRef.current) {
          const first = modalRef.current.querySelector<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
          );
          first?.focus();
        }
      });

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        previousFocusRef.current?.focus();
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  const titleId = `modal-title-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const descId = description
    ? `modal-desc-${title.replace(/\s+/g, "-").toLowerCase()}`
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative bg-white border border-black/8 rounded-lg shadow-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-0 shrink-0">
          <div className="space-y-1 min-w-0 pr-4">
            <h2
              id={titleId}
              className="text-base font-semibold text-[#0a0a0a] tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm text-[#717182]">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex items-center justify-center w-6 h-6 rounded-md text-[#717182] hover:text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-black/8 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
