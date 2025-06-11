'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateContent } from '@/lib/database'

interface InlineEditProps {
  contentKey: string
  initialContent: string
  className?: string
  placeholder?: string
  onUpdate?: (newContent: string) => void
}

export function InlineEdit({ 
  contentKey, 
  initialContent, 
  className = '', 
  placeholder = 'Click to edit...',
  onUpdate
}: InlineEditProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea and focus when editing starts - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.focus()
      
      // Auto-resize
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [isEditing])

  // Don't show edit functionality if not logged in
  if (!user) {
    return <p className={className}>{content}</p>
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (content.trim() === '') return
    
    setIsSaving(true)
    try {
      const result = await updateContent(contentKey, content.trim())
      if (result) {
        onUpdate?.(content.trim())
        setIsEditing(false)
      } else {
        // Show a helpful message if the content table doesn't exist
        alert('Content table not found. Please run the content_table.sql script in your Supabase dashboard to enable inline editing.')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please check the console for details.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${className} min-h-[2em] w-full resize-none border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 bg-white`}
          placeholder={placeholder}
          disabled={isSaving}
        />
        {/* Buttons directly below the textarea */}
        <div className="flex items-center gap-2 mt-1 mb-2">
          <button
            onClick={handleSave}
            disabled={isSaving || content.trim() === ''}
            className="btn-primary btn-sm"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="btn-secondary btn-sm"
          >
            Cancel
          </button>
          <span className="text-xs text-gray-500 ml-2">
            ⌘+Enter to save, Esc to cancel
          </span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
    >
      <p className={className}>
        {content || placeholder}
      </p>
      
      {/* Edit icon - only visible on hover */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg opacity-90 hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      )}
      
      {/* Subtle visual hint when hovering */}
      {isHovered && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg opacity-30 pointer-events-none"></div>
      )}
    </div>
  )
} 