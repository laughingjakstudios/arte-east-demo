'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFilms } from '@/lib/database'
import type { Film } from '@/types'

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')

  useEffect(() => {
    loadFilms()
  }, [])

  useEffect(() => {
    filterFilms()
  }, [films, searchTerm, statusFilter])

  const loadFilms = async () => {
    setLoading(true)
    try {
      const result = await getFilms()
      if (result.error) {
        console.error('Error loading films:', result.error)
      } else {
        setFilms(result.data || [])
      }
    } catch (error) {
      console.error('Error loading films:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFilms = () => {
    let filtered = films

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(film => 
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(film => film.status === statusFilter)
    }

    setFilteredFilms(filtered)
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
      <div className="main-content">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-8 w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card">
                  <div className="card-body">
                    <div className="skeleton h-6 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-full mb-4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="heading-1 mb-2">Films</h1>
              <p className="text-muted">
                Manage your film collection ({filteredFilms.length} {filteredFilms.length === 1 ? 'film' : 'films'})
              </p>
            </div>
            <Link href="/films/new" className="btn-primary mt-4 sm:mt-0">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Film
            </Link>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">Search films</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search films..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="sm:w-48">
                  <label htmlFor="status" className="sr-only">Filter by status</label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                    className="form-input"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Films List */}
          {filteredFilms.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-12">
                <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v14h12V6H6zm3-2V2h6v2H9z" />
                </svg>
                <h3 className="heading-3 mb-2">No films found</h3>
                <p className="text-muted mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first film.'}
                </p>
                <Link href="/films/new" className="btn-primary">
                  Create New Film
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFilms.map((film) => (
                <div key={film.id} className="card hover:shadow-medium transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="heading-3 truncate">
                            <Link 
                              href={`/films/${film.id}`}
                              className="text-neutral-900 hover:text-arte-600 transition-colors"
                            >
                              {film.title}
                            </Link>
                          </h3>
                          <span className={film.status === 'published' ? 'badge-published' : 'badge-draft'}>
                            {film.status}
                          </span>
                        </div>
                        <p className="text-neutral-600 line-clamp-2 mb-3">
                          {film.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <span>Created {formatDate(film.created_at)}</span>
                          {film.updated_at !== film.created_at && (
                            <span>Updated {formatDate(film.updated_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link 
                          href={`/films/${film.id}`}
                          className="btn-ghost btn-sm"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/films/${film.id}/edit`}
                          className="btn-secondary btn-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 