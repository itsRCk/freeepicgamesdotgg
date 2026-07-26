'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePrice } from '@/hooks/use-price';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CurrencySelector() {
  const { currency, setCurrency, mounted } = usePrice();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="h-8 w-20 animate-pulse rounded-md border border-white/10 bg-[#111]" />
    );
  }

  const activeConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const currenciesList = Object.values(SUPPORTED_CURRENCIES);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-[#111] px-2.5 text-xs font-mono font-medium text-[#ccc] transition-colors hover:border-white/20 hover:text-white",
          isOpen && "border-white/20 bg-[#161616] text-white"
        )}
        aria-label="Select currency"
        title="Select currency"
      >
        <Globe className="h-3.5 w-3.5 text-[#888]" />
        <span>{activeConfig.symbol} {activeConfig.code}</span>
        <ChevronDown className={cn("h-3 w-3 text-[#666] transition-transform duration-150", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-48 rounded-lg border border-white/10 bg-[#111] p-1 shadow-2xl backdrop-blur-md">
          <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#666]">
            Select Currency
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {currenciesList.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-mono transition-colors",
                    isSelected
                      ? "bg-white/10 text-white font-medium"
                      : "text-[#999] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-center text-[#888] font-semibold">{c.symbol}</span>
                    <span>{c.code}</span>
                    <span className="text-[10px] text-[#666] font-sans">({c.name})</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
