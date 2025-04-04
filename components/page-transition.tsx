"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentChildren, setCurrentChildren] = useState(children)

  useEffect(() => {
    // When the pathname changes, start the animation
    setIsAnimating(true)

    // After a short delay, update the children
    const timer = setTimeout(() => {
      setCurrentChildren(children)
      setIsAnimating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
    >
      {currentChildren}
    </div>
  )
}

