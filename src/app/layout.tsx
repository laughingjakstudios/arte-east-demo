import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdminBar } from '@/components/AdminBar'
import { AdminSidebar } from '@/components/AdminSidebar'
import { AdminLayout } from '@/components/AdminLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ARTE EAST CMS',
  description: 'Content Management System for ARTE EAST - Contemporary arts from the Middle East and North Africa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminBar />
          <AdminSidebar />
          <AdminLayout>
            {children}
          </AdminLayout>
        </AuthProvider>
      </body>
    </html>
  )
} 