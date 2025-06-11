'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { InlineEdit } from '@/components/InlineEdit'
import { getContent, getFilms } from '@/lib/database'
import { useAuth } from '@/contexts/AuthContext'
import type { Film } from '@/types'

export default function Home() {
  const { user } = useAuth()
  const [contentData, setContentData] = useState<Record<string, string>>({})
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
    loadFilms()
  }, [])

  // Clean up URL tokens after user auth state is determined
  useEffect(() => {
    console.log('Page useEffect - user state:', user)
    console.log('Current URL hash:', window.location.hash)
    
    // Only clean up if we have a confirmed user session OR after a delay to let Supabase process
    if (user) {
      console.log('User authenticated, cleaning up URL')
      cleanupUrl()
    } else if (user === null && window.location.hash.includes('access_token')) {
      // If user is null but we have tokens, wait a bit for Supabase to process
      console.log('User null but tokens present, waiting before cleanup')
      const timeout = setTimeout(() => {
        console.log('Timeout reached, cleaning up URL')
        cleanupUrl()
      }, 3000) // 3 second delay
      
      return () => clearTimeout(timeout)
    }
  }, [user])

  const cleanupUrl = () => {
    // Remove authentication tokens from URL after auth is processed
    console.log('cleanupUrl called, hash contains access_token:', window.location.hash.includes('access_token'))
    if (window.location.hash.includes('access_token')) {
      console.log('Cleaning up URL hash')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  const loadFilms = async () => {
    try {
      const result = await getFilms()
      if (result.data) {
        // Show only published films, limit to 6 for homepage
        const publishedFilms = result.data
          .filter(film => film.status === 'published')
          .slice(0, 6)
        setFilms(publishedFilms)
      }
    } catch (error) {
      console.error('Error loading films:', error)
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Film Management</p>
                    <p className="text-sm text-neutral-500">CRUD operations complete</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Authentication</p>  
                    <p className="text-sm text-neutral-500">Google OAuth active</p>
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

          {/* Films Section */}
          {films.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-2">Recent Films</h2>
                <Link href="/films" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {films.map((film) => (
                  <div key={film.id} className="card hover:shadow-medium transition-shadow">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="heading-3 text-left">
                          <Link 
                            href={`/films/${film.id}`}
                            className="text-neutral-900 hover:text-blue-600 transition-colors"
                          >
                            {film.title}
                          </Link>
                        </h3>
                        <span className="badge-published">published</span>
                      </div>
                      <p className="text-neutral-600 text-sm mb-3 text-left line-clamp-3">
                        {film.description}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(film.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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