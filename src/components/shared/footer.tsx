import Link from "next/link"
import * as React from "react"

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
        <p className="text-xs text-[#555]">
          Not affiliated with Epic Games. Built for the community.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-xs text-[#555] hover:text-[#888] transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-xs text-[#555] hover:text-[#888] transition-colors">
            Privacy
          </Link>
          <a
            href="https://github.com/itsRCk/freeepicgamesdotgg"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#555] hover:text-[#888] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
