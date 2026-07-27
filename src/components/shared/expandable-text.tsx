'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  children: React.ReactNode;
  maxLines?: number; // default 6
  className?: string;
  buttonClassName?: string;
}

export function ExpandableText({
  children,
  maxLines = 6,
  className,
  buttonClassName,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      // Check if scrollHeight exceeds clamped clientHeight
      const hasOverflow = el.scrollHeight > el.clientHeight + 4;
      setIsOverflowing(hasOverflow);
    }
  }, [children, maxLines]);

  const clampClass =
    maxLines === 5
      ? 'line-clamp-5'
      : maxLines === 4
      ? 'line-clamp-4'
      : 'line-clamp-6';

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={cn(
          'transition-all duration-300 overflow-hidden',
          !isExpanded && clampClass,
          className
        )}
      >
        {children}
      </div>

      {!isExpanded && isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent pointer-events-none" />
      )}

      {(isOverflowing || isExpanded) && (
        <div className="mt-3 flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#ededed] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-md transition-all shadow-sm group',
              buttonClassName
            )}
          >
            {isExpanded ? (
              <>
                Show less{' '}
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Read more{' '}
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
