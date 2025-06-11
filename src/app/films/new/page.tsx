'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createFilm } from '@/lib/database'

export default function NewFilmPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft' as 'draft' | 'published'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const result = await createFilm({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status
      })

      if (result.error) {
        setErrors({ submit: result.error })
      } else {
        // Redirect to the new film's page
        router.push(`/films/${result.data?.id}`)
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="main-content">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link href="/films" className="hover:text-arte-600 transition-colors">
                Films
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>New Film</span>
            </div>
            <h1 className="heading-1">Create New Film</h1>
            <p className="text-muted mt-2">
              Add a new film to your collection. You can save as draft or publish immediately.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="heading-3">Film Details</h2>
              </div>
              <div className="card-body space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="form-label">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter the film title..."
                    className={`form-input ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="form-error">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="form-label">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the film, its themes, and significance..."
                    rows={6}
                    className={`form-textarea ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="form-error">{errors.description}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="form-label">
                    Publication Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="draft">Draft - Save for later</option>
                    <option value="published">Published - Make visible to public</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.status === 'draft' 
                      ? 'Film will be saved as draft and not visible to the public'
                      : 'Film will be immediately visible to the public'}
                  </p>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Link href="/films" className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </Link>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'draft' }))
                    setTimeout(() => handleSubmit(new Event('submit') as any), 0)
                  }}
                  disabled={loading}
                  className="btn-secondary"
                >
                  {loading && formData.status === 'draft' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save as Draft'
                  )}
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                  className="btn-primary"
                >
                  {loading && formData.status === 'published' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish Film'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 