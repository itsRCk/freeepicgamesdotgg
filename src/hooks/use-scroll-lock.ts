'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

// Global counter to handle multiple, stacked, or transitioning modals safely
let activeLockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyPaddingRight = '';

/**
 * Locks the site scroll by freezing body and HTML overflow, compensating for
 * scrollbar width to prevent layout shift, and stopping Lenis smooth scroll.
 */
export function lockScroll(lenis?: any) {
  if (typeof document === 'undefined') return;

  if (activeLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar disappearing on desktop browsers
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  activeLockCount++;
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
}

/**
 * Unlocks the site scroll once all active modals have closed.
 */
export function unlockScroll(lenis?: any) {
  if (typeof document === 'undefined') return;

  activeLockCount = Math.max(0, activeLockCount - 1);

  if (activeLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;

    if (lenis && typeof lenis.start === 'function') {
      lenis.start();
    }
  }
}

/**
 * Hook to lock background scrolling while a modal/dialog is open.
 * @param isLocked Whether the scroll lock is active (e.g. `isOpen`)
 */
export function useScrollLock(isLocked: boolean = true) {
  const lenis = useLenis();
  const lockedByThisRef = useRef(false);

  useEffect(() => {
    if (isLocked && !lockedByThisRef.current) {
      lockScroll(lenis);
      lockedByThisRef.current = true;
    } else if (!isLocked && lockedByThisRef.current) {
      unlockScroll(lenis);
      lockedByThisRef.current = false;
    }

    // Ensure Lenis stops if initialized after effect starts while locked
    if (isLocked && lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    return () => {
      if (lockedByThisRef.current) {
        unlockScroll(lenis);
        lockedByThisRef.current = false;
      }
    };
  }, [isLocked, lenis]);
}
