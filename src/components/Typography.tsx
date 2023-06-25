import { type PropsWithChildren } from "react"

export const H2 = ({children}: PropsWithChildren) => (
  <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {children}
  </h2>
)

export const P = ({children}: PropsWithChildren) => (
  <p className="leading-7 [&:not(:first-child)]:mt-6">
    {children}
  </p>
);

