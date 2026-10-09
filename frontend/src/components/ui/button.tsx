import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7053f2] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#5b42e6] dark:bg-[#7053f2] text-white shadow-sm hover:bg-[#4f36db] dark:hover:bg-[#5f41ea] active:bg-[#452dc4]',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600',
        outline:
          'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        secondary:
          'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-200/80 dark:hover:bg-slate-700/80',
        ghost:
          'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
        link:
          'text-[#5b42e6] dark:text-[#a5b4fc] underline-offset-4 hover:underline',
        accent:
          'bg-[#f3f0ff] dark:bg-indigo-950/60 text-[#4f36db] dark:text-indigo-300 border border-[#ddd6fe] dark:border-indigo-900/60 hover:bg-[#ebe5ff] dark:hover:bg-indigo-950/90 shadow-xs font-semibold',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
