"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useUIStore } from "@/store/use-ui-store";

function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // 1. Immediately reset native window scroll
    window.scrollTo(0, 0);

    // 2. Immediately reset Lenis scroll position to 0 without animation
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // 3. After the new route's DOM finishes rendering and layout paint,
    // force Lenis to recalculate dimensions and ensure scroll remains at 0
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true });
      }
    });

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true });
      }
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, lenis]);

  return null;
}

function GlobalModalScrollWatcher() {
  const lenis = useLenis();
  const { searchOpen, selectedGameId } = useUIStore();

  useEffect(() => {
    // Failsafe observer to guarantee background scroll is halted whenever any modal is active
    const checkModals = () => {
      const isStoreModalOpen = searchOpen || Boolean(selectedGameId);
      const domModals = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');
      const hasDomModal = Array.from(domModals).some((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });

      if ((isStoreModalOpen || hasDomModal) && lenis) {
        lenis.stop();
      }
    };

    checkModals();

    const observer = new MutationObserver(() => {
      checkModals();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'style', 'class', 'role'],
    });

    return () => {
      observer.disconnect();
    };
  }, [searchOpen, selectedGameId, lenis]);

  return null;
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <ScrollResetOnNavigate />
      <GlobalModalScrollWatcher />
      {children}
    </ReactLenis>
  );
}

