'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface GeistSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function GeistSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  ariaLabel,
}: GeistSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block w-full', className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-[#111] px-3 text-sm text-[#ededed]',
          'hover:border-white/20 hover:bg-[#161616]',
          'focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20',
          'transition-colors duration-150 cursor-pointer select-none',
          isOpen && 'border-white/30 ring-1 ring-white/20 bg-[#161616]'
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-[#888] transition-transform duration-150 flex-shrink-0 ml-2', isOpen && 'rotate-180 text-white')} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-full w-max max-h-60 overflow-y-auto rounded-md border border-white/15 bg-[#111] p-1 shadow-2xl backdrop-blur-md animate-in fade-in-80 slide-in-from-top-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-1.5 text-sm rounded-sm cursor-pointer select-none transition-colors',
                  isSelected
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-[#888] hover:bg-white/5 hover:text-[#ededed]'
                )}
              >
                <span className="truncate mr-3">{option.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-white flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
