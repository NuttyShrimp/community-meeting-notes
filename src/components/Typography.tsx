import { type PropsWithChildren } from "react"
import { cn } from "~/lib/utils";

export const H2 = ({children}: PropsWithChildren) => (
  <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {children}
  </h2>
)

export const H3 = ({children, className}: PropsWithChildren<{className?: string}>) => (
  <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
    {children}
  </h3>
)

export const P = ({children, className}: PropsWithChildren<{className?: string}>) => (
  <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
    {children}
  </p>
);

