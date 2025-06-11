'use client'

import { useEffect, useState } from 'react'
import { testConnection, getFilms, createFilm } from '@/lib/database'
import type { Film } from '@/types'

export default function TestDatabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    testDatabaseConnection()
  }, [])

  const testDatabaseConnection = async () => {
    try {
      // Test connection
      const connectionResult = await testConnection()
      
      if (connectionResult.success) {
        setConnectionStatus('✅ Connected to Supabase!')
        
        // Try to fetch films
        const filmsResult = await getFilms()
        if (filmsResult.error) {
          setConnectionStatus(`⚠️ Connected but error fetching films: ${filmsResult.error}`)
        } else {
          setFilms(filmsResult.data || [])
        }
      } else {
        setConnectionStatus(`❌ Connection failed: ${connectionResult.error}`)
      }
    } catch (error) {
      setConnectionStatus(`❌ Connection failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const createSampleFilm = async () => {
    setCreating(true)
    try {
      const sampleFilm = {
        title: `Sample Film ${Date.now()}`,
        description: 'This is a test film created to verify database functionality.',
        status: 'draft' as const
      }

      const result = await createFilm(sampleFilm)
      if (result.error) {
        alert(`Error creating film: ${result.error}`)
      } else {
        alert('Film created successfully!')
        // Refresh the films list
        testDatabaseConnection()
      }
    } catch (error) {
      alert(`Error: ${error}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Database Connection Test
          </h1>
          
          <div className="mb-4">
            <p className="text-lg">
              <strong>Status:</strong> {connectionStatus}
            </p>
          </div>

          {!loading && connectionStatus.includes('✅') && (
            <div className="mb-4">
              <button
                onClick={createSampleFilm}
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Sample Film'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Films in Database ({films.length})
          </h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : films.length === 0 ? (
            <p className="text-gray-600">No films found. Create one using the button above!</p>
          ) : (
            <div className="space-y-4">
              {films.map((film) => (
                <div key={film.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{film.title}</h3>
                  <p className="text-gray-600 mt-1">{film.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded ${
                      film.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {film.status}
                    </span>
                    <span>Created: {new Date(film.created_at).toLocaleDateString()}</span>
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