"use client";
import React, { useEffect, useRef } from "react";

const BACKDROP_CLASSES = {
  30: "bg-black/30",
  50: "bg-black/50",
};

// Open modals, oldest first. Escape only closes the topmost one, so a profile
// stacked over an aspect list closes alone.
const openModals = [];

const Modal = ({ children, onClose, backdropOpacity = 50, className = "", ariaLabel }) => {
  const containerRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  // Callers pass a new onClose every render; keep the latest in a ref so the
  // effect below runs once on mount and doesn't re-steal focus on re-render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const token = {};
    openModals.push(token);
    previouslyFocusedRef.current = document.activeElement;
    containerRef.current?.focus();

    const FOCUSABLE_SELECTOR =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (openModals[openModals.length - 1] !== token) return;

      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (e.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      openModals.splice(openModals.indexOf(token), 1);
      previouslyFocusedRef.current?.focus?.();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center ${
        BACKDROP_CLASSES[backdropOpacity] || BACKDROP_CLASSES[50]
      } backdrop-blur-[2px]`}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`w-full md:w-[500px] bg-surface-elevated text-foreground border border-border rounded-t-lg md:rounded-lg shadow-2xl p-6 max-h-[80vh] overflow-y-auto focus:outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
