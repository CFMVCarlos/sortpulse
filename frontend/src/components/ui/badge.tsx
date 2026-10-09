import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#7053f2] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#5b42e6] dark:bg-[#7053f2] text-white shadow-xs',
        secondary:
          'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        accent:
          'border-[#ddd6fe] dark:border-indigo-900/60 bg-[#f3f0ff] dark:bg-indigo-950/60 text-[#4f36db] dark:text-indigo-300',
        outline:
          'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
        success:
          'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
        warning:
          'border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
        destructive:
          'border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
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
