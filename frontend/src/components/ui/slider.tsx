import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center cursor-pointer py-1 data-[disabled]:opacity-40 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed transition-opacity duration-200',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100">
      <SliderPrimitive.Range className="absolute h-full bg-[#5b42e6] data-[disabled]:bg-slate-400" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border-2 border-[#5b42e6] bg-white shadow-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7053f2] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:border-slate-400 data-[disabled]:shadow-none"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
