import * as React from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

/** Standard page title block with an optional actions slot. */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="relative rounded-3xl border bg-card p-4 sm:flex sm:items-center sm:justify-between sm:p-6">
      <div className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="relative mt-4 flex w-full flex-wrap items-center gap-2 sm:mt-0 sm:w-auto sm:justify-end [&>*]:max-w-full">
          {children}
        </div>
      ) : null}
    </div>
  )
}
