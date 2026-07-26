import Link from "next/link"
import * as React from "react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for the community. Not affiliated with Epic Games.
        </p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-4 hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
