// components/SkipLinks.tsx
'use client'

import { colors } from "@/src/config/colors"
import { ArrowDownIcon } from "@heroicons/react/24/outline"

export function SkipLinks() {
  return (
    <div className="fixed top-0 left-0 z-50" style={{
        width: '500px'
    }}>
      <a 
        style={{ 
            textDecoration: 'none',
            width: 'fit-content',
            height: 'fit-content',
            border: '3px solid ' + colors.pink,
            fontWeight: '600',
            outline: 'none',
        }}
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:shadow-lg focus:outline-none"
      >
        <ArrowDownIcon className="inline-block h-5 w-5 mr-2" />
        Aller au contenu principal
      </a>
    </div>
  )
}