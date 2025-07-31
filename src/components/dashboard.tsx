'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

import MapView from './map-view'
import CalendarView from './calendar-view'
import JobsList from './jobs-list'
import CreateJobForm from './create-job-form'

// Type definition for view modes
type View = 'map' | 'calendar' | 'list'

/**
 * Dashboard Component
 * 
 * Main dashboard interface for the dispatch application featuring:
 * - Multi-view display (List, Map, Calendar)
 * - Job management and creation
 * - Technician tracking
 * - Role-based access control
 * 
 * Fetches jobs and technicians data on mount and provides view switching functionality.
 * Only ADMIN and DISPATCHER roles can create new jobs.
 */
export default function Dashboard() {
  // Session management for authentication and user info
  const { data: session } = useSession()
  
  // State management for UI and data
  const [currentView, setCurrentView] = useState<View>('list')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [jobs, setJobs] = useState([])
  const [technicians, setTechnicians] = useState([])

  // Fetch initial data on component mount
  useEffect(() => {
    fetchJobs()
    fetchTechnicians()
  }, [])

  /**
   * Fetches all jobs from the API
   * Updates jobs state on successful response
   */
  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  /**
   * Fetches all technicians from the API
   * Updates technicians state on successful response
   */
  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians')
      if (response.ok) {
        const data = await response.json()
        setTechnicians(data)
      }
    } catch (error) {
      console.error('Error fetching technicians:', error)
    }
  }

  /**
   * Handles successful job creation
   * Closes the create form and refreshes job list
   */
  const handleJobCreated = () => {
    setShowCreateForm(false)
    fetchJobs()
  }

  /**
   * Renders the appropriate view component based on currentView state
   * @returns React component for the selected view
   */
  const renderView = () => {
    switch (currentView) {
      case 'map':
        return <MapView jobs={jobs} technicians={technicians} onJobUpdate={fetchJobs} />
      case 'calendar':
        return <CalendarView jobs={jobs} onJobUpdate={fetchJobs} />
      case 'list':
      default:
        return <JobsList jobs={jobs} technicians={technicians} onJobUpdate={fetchJobs} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar with user info and controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* User welcome message with role display */}
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-700">
                Welcome, {session?.user?.name} ({session?.user?.role})
              </span>
            </div>
            
            {/* Right side controls: view switcher, create button, sign out */}
            <div className="flex items-center space-x-4">
              {/* View switching buttons with active state styling */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentView === 'list' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setCurrentView('map')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentView === 'map' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentView === 'calendar' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Calendar
                </button>
              </div>
              
              {/* Create Job button - only visible to ADMIN and DISPATCHER roles */}
              {(session?.user?.role === 'ADMIN' || session?.user?.role === 'DISPATCHER') && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Job
                </button>
              )}
              
              {/* Sign out button */}
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - renders the selected view component */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Modal form for creating new jobs - conditionally rendered */}
      {showCreateForm && (
        <CreateJobForm
          onClose={() => setShowCreateForm(false)}
          onJobCreated={handleJobCreated}
        />
      )}
    </div>
  )
}