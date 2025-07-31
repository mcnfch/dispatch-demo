'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Header from './header'
import MapView from './map-view'
import CalendarView from './calendar-view'
import JobsList from './jobs-list'
import CreateJobForm from './create-job-form'

type View = 'map' | 'calendar' | 'list'

export default function Dashboard() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<View>('list')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [jobs, setJobs] = useState([])
  const [technicians, setTechnicians] = useState([])

  useEffect(() => {
    fetchJobs()
    fetchTechnicians()
  }, [])

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

  const handleJobCreated = () => {
    setShowCreateForm(false)
    fetchJobs()
  }

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
      <Header />
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-700">
                Welcome, {session?.user?.name} ({session?.user?.role})
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              {(session?.user?.role === 'ADMIN' || session?.user?.role === 'DISPATCHER') && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Job
                </button>
              )}
              
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {showCreateForm && (
        <CreateJobForm
          onClose={() => setShowCreateForm(false)}
          onJobCreated={handleJobCreated}
        />
      )}
    </div>
  )
}