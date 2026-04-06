import type { PropsWithChildren, ReactNode } from 'react'

export const LayoutShell = ({ header, children }: PropsWithChildren<{ header: ReactNode }>) => (
  <div className="app-shell">
    <header className="hero-panel">{header}</header>
    <main className="content-grid">{children}</main>
  </div>
)
