export interface Film {
  id: string
  title: string
  description: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export interface AdminBarProps {
  user: User | null
  onLogout: () => void
}

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
} 