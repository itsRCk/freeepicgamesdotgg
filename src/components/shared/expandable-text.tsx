'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  text?: string | string[];
  children?: React.ReactNode;
  maxLines?: number; // default 6
  charLimit?: number;
  className?: string;
}

export function ExpandableText({
  text,
  children,
  maxLines = 6,
  charLimit,
  className,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text prop is provided, implement inline character truncation with clickable read more.
  if (text !== undefined) {
    const paragraphs = Array.isArray(text) ? text : [text];
    const fullText = paragraphs.join(' ');
    const limit = charLimit || (maxLines === 5 ? 380 : 480);

    if (fullText.length <= limit) {
      return (
        <div className={className}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className="mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      );
    }

    if (!isExpanded) {
      const rawSlice = fullText.slice(0, limit);
      const lastSpace = rawSlice.lastIndexOf(' ');
      const trimmed = lastSpace > 0 ? rawSlice.slice(0, lastSpace) : rawSlice;
      const cleanTruncated = trimmed.replace(/[.,;:\s]+$/, '');

      return (
        <div className={className}>
          <p className="inline">
            {cleanTruncated}
            <span className="text-[#888]">....</span>
            <button
              onClick={() => setIsExpanded(true)}
              className="inline font-medium text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors select-none"
            >
              read more.
            </button>
          </p>
        </div>
      );
    }

    return (
      <div className={className}>
        {paragraphs.map((para, idx) => (
          <p key={idx} className="mb-4 last:mb-0 inline-block w-full">
            {para}
            {idx === paragraphs.length - 1 && (
              <button
                onClick={() => setIsExpanded(false)}
                className="inline ml-2 font-medium text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors select-none"
              >
                show less.
              </button>
            )}
          </p>
        ))}
      </div>
    );
  }

  // Fallback if children is used instead of text prop
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
