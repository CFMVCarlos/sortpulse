import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#7053f2] focus-ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#5b42e6] text-white shadow-xs',
        secondary:
          'border-slate-200 bg-slate-100 text-slate-800',
        accent:
          'border-[#ddd6fe] bg-[#f3f0ff] text-[#4f36db]',
        outline:
          'border-slate-200 text-slate-700',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning:
          'border-amber-200 bg-amber-50 text-amber-700',
        destructive:
          'border-rose-200 bg-rose-50 text-rose-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
