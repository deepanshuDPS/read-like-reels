"use client"

import { pageview } from "@/utils/supabase/client"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return null
}

