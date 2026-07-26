'use client';

import React from 'react';
import { usePrice } from '@/hooks/use-price';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  as?: React.ElementType;
}

export function PriceDisplay({ amount, className, as: Component = 'span' }: PriceDisplayProps) {
  const { format } = usePrice();

  return (
    <Component className={cn(className)}>
      {format(amount)}
    </Component>
  );
}
