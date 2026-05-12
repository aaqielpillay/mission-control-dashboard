"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  ariaLabel?: string;
}

export default function SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  ariaLabel,
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Focus trap + restore focus
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      // Focus close button after animation
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Focus trap: Tab cycling
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onKeyDown={handleKeyDown}
            className="fixed top-0 right-0 bottom-0 w-[420px] max-w-full bg-surface border-l border-border-subtle z-50 flex flex-col shadow-2xl"
            style={{ boxShadow: "-8px 0 32px rgba(0,0,0,0.4)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-border-subtle flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-txt-primary truncate">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-txt-muted truncate">{subtitle}</p>
                )}
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-1.5 rounded hover:bg-surface-raised transition-colors text-txt-ghost hover:text-txt-secondary flex-shrink-0"
                aria-label="Close panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-5 py-3 border-t border-border-subtle flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
