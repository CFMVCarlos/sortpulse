#!/bin/bash
cat << 'INNER_EOF' > frontend/src/components/ui/skeleton.tsx
import React from "react"
import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/50 dark:bg-slate-800/50", className)}
      {...props}
    />
  )
}

export { Skeleton }
INNER_EOF
