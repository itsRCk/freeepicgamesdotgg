'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

// Global counter to handle multiple, stacked, or transitioning modals safely
let activeLockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyPaddingRight = '';
let isListenersAttached = false;

// Capture-phase wheel handler to block background mouse scroll
function onWheelCapture(e: WheelEvent) {
  if (activeLockCount <= 0) return;

  const target = e.target as HTMLElement | null;
  if (!target) {
    e.preventDefault();
    return;
  }

  // Check if target is inside an element designated for internal scrolling
  const scrollable = target.closest('[data-modal-scrollable]');
  if (!scrollable) {
    // Over backdrop, background, or non-scrollable header/modal area -> ALWAYS block scroll
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // Inside a scrollable container: allow scrolling, but prevent overscroll bleed-through
  const el = scrollable as HTMLElement;
  if (el.scrollHeight <= el.clientHeight) {
    e.preventDefault();
    return;
  }

  const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
  const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;

  if (isAtTop || isAtBottom) {
    e.preventDefault();
  }
}

// Capture-phase touchmove handler for mobile devices
function onTouchMoveCapture(e: TouchEvent) {
  if (activeLockCount <= 0) return;

  const target = e.target as HTMLElement | null;
  if (!target) {
    e.preventDefault();
    return;
  }

  const scrollable = target.closest('[data-modal-scrollable]');
  if (!scrollable) {
    e.preventDefault();
  }
}

// Block keyboard scrolling keys (Space, PageUp, PageDown, End, Home) when not in an input
function onKeyDownCapture(e: KeyboardEvent) {
  if (activeLockCount <= 0) return;

  const target = e.target as HTMLElement | null;
  const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

  if (isInput) return;

  const scrollKeys = ['Space', ' ', 'PageUp', 'PageDown', 'End', 'Home'];
  if (scrollKeys.includes(e.key)) {
    const scrollable = target?.closest('[data-modal-scrollable]');
    if (!scrollable) {
      e.preventDefault();
    }
  }
}

function attachGlobalListeners() {
  if (isListenersAttached || typeof window === 'undefined') return;
  window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });
  window.addEventListener('touchmove', onTouchMoveCapture, { passive: false, capture: true });
  window.addEventListener('keydown', onKeyDownCapture, { capture: true });
  isListenersAttached = true;
}

function detachGlobalListeners() {
  if (!isListenersAttached || typeof window === 'undefined') return;
  window.removeEventListener('wheel', onWheelCapture, { capture: true } as any);
  window.removeEventListener('touchmove', onTouchMoveCapture, { capture: true } as any);
  window.removeEventListener('keydown', onKeyDownCapture, { capture: true } as any);
  isListenersAttached = false;
}

/**
 * Locks the site scroll by freezing body and HTML overflow, compensating for
 * scrollbar width to prevent layout shift, stopping Lenis smooth scroll, and
 * blocking capture-phase wheel and touch events on the background.
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
    document.documentElement.classList.add('modal-scroll-locked');
    document.body.classList.add('modal-scroll-locked');

    attachGlobalListeners();
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
    document.documentElement.classList.remove('modal-scroll-locked');
    document.body.classList.remove('modal-scroll-locked');

    detachGlobalListeners();

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
