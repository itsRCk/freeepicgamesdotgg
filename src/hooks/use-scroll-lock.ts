'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

// Global counter to handle multiple, stacked, or transitioning modals safely
let activeLockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyPaddingRight = '';

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

    // Apply strict CSS lock
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.classList.add('modal-scroll-locked');
    document.body.classList.add('modal-scroll-locked');
  }

  activeLockCount++;
  
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
}

export function unlockScroll(lenis?: any) {
  if (typeof document === 'undefined') return;

  activeLockCount = Math.max(0, activeLockCount - 1);

  if (activeLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
    
    document.documentElement.classList.remove('modal-scroll-locked');
    document.body.classList.remove('modal-scroll-locked');

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

    return () => {
      if (lockedByThisRef.current) {
        unlockScroll(lenis);
        lockedByThisRef.current = false;
      }
    };
  }, [isLocked, lenis]);
}
