import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "shimmer rounded-2xl bg-muted/80 dark:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
