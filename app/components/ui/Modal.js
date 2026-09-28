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

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && openModals[openModals.length - 1] === token) {
        onCloseRef.current?.();
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
        className={`w-full md:w-[500px] bg-surface-elevated text-foreground border border-border rounded-t-2xl md:rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto focus:outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
