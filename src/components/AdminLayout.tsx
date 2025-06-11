'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function AdminLayout({ children }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="pt-16 pl-64">
      {children}
    </div>
  )
} 