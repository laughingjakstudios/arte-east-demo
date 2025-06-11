'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { InlineEdit } from '@/components/InlineEdit'
import { getContent } from '@/lib/database'

export default function Home() {
  const [contentData, setContentData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      // Load all the content keys we need
      const contentKeys = [
        'homepage_subtitle',
        'homepage_description',
        'film_management_description',
        'admin_tools_description'
      ]

      // Try to load content, but don't fail if table doesn't exist
      const contentPromises = contentKeys.map(async (key) => {
        try {
          return await getContent(key)
        } catch {
          return null
        }
      })
      
      const results = await Promise.all(contentPromises)
      
      const contentMap: Record<string, string> = {}
      contentKeys.forEach((key, index) => {
        contentMap[key] = results[index]?.content || getDefaultContent(key)
      })
      
      setContentData(contentMap)
    } catch (error) {
      // Fallback to default content
      setContentData({
        homepage_subtitle: 'Contemporary arts from the Middle East and North Africa',
        homepage_description: 'A modern, streamlined CMS built specifically for ARTE EAST. Manage films, exhibitions, and content with ease using our custom-built platform.',
        film_management_description: 'Create, edit, and manage film entries with an intuitive interface. Support for drafts, publishing, and inline editing.',
        admin_tools_description: 'Comprehensive admin interface with user management, content moderation, and publishing workflows.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = (key: string): string => {
    const defaults: Record<string, string> = {
      homepage_subtitle: 'Contemporary arts from the Middle East and North Africa',
      homepage_description: 'A modern, streamlined CMS built specifically for ARTE EAST. Manage films, exhibitions, and content with ease using our custom-built platform.',
      film_management_description: 'Create, edit, and manage film entries with an intuitive interface. Support for drafts, publishing, and inline editing.',
      admin_tools_description: 'Comprehensive admin interface with user management, content moderation, and publishing workflows.'
    }
    return defaults[key] || 'Click to edit this content...'
  }

  const handleContentUpdate = (key: string, newContent: string) => {
    setContentData(prev => ({
      ...prev,
      [key]: newContent
    }))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-neutral-900 mb-4">
              ARTE EAST
            </h1>
            <InlineEdit
              contentKey="homepage_subtitle"
              initialContent={contentData.homepage_subtitle}
              className="text-xl text-gray-600 mb-8"
              onUpdate={(newContent) => handleContentUpdate('homepage_subtitle', newContent)}
            />
          </div>

          {/* Status Card */}
          <div className="card mb-12">
            <div className="card-header">
              <h2 className="heading-2">
                Content Management System
              </h2>
            </div>
            <div className="card-body">
              <InlineEdit
                contentKey="homepage_description"
                initialContent={contentData.homepage_description}
                className="text-gray-600 leading-relaxed mb-6"
                onUpdate={(newContent) => handleContentUpdate('homepage_description', newContent)}
              />
              
              {/* Feature Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Modern Stack</p>
                    <p className="text-sm text-neutral-500">Next.js, TypeScript, Tailwind CSS</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Database Ready</p>
                    <p className="text-sm text-neutral-500">Supabase integration complete</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-warning-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Film Management</p>
                    <p className="text-sm text-neutral-500">CRUD operations in progress</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-warning-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Authentication</p>
                    <p className="text-sm text-neutral-500">Google OAuth integration planned</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/films" className="btn-secondary btn-lg">
                  Explore Films
                </Link>
              </div>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-body">
                <h3 className="heading-3 mb-3">Film Management</h3>
                <InlineEdit
                  contentKey="film_management_description"
                  initialContent={contentData.film_management_description}
                  className="text-gray-600 mb-4"
                  onUpdate={(newContent) => handleContentUpdate('film_management_description', newContent)}
                />
                <Link href="/films" className="btn-primary">
                  View Films →
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <h3 className="heading-3 mb-3">Admin Tools</h3>
                <InlineEdit
                  contentKey="admin_tools_description"
                  initialContent={contentData.admin_tools_description}
                  className="text-gray-600 mb-4"
                  onUpdate={(newContent) => handleContentUpdate('admin_tools_description', newContent)}
                />
                <button className="btn-secondary" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 