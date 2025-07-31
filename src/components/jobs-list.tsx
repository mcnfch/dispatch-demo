'use client'

import { useState } from 'react'

interface Job {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  customerName: string
  customerPhone?: string
  customerEmail?: string
  location: {
    address: string
    city: string
    state: string
  }
  technician?: {
    id: string
    name: string
  }
  scheduledAt?: string
  createdAt: string
}

interface Technician {
  id: string
  name: string
  email: string
}

interface JobsListProps {
  jobs: Job[]
  technicians: Technician[]
  onJobUpdate: () => void
}

export default function JobsList({ jobs, technicians, onJobUpdate }: JobsListProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAssignJob = async (jobId: string, technicianId: string) => {
    setIsAssigning(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technicianId }),
      })

      if (response.ok) {
        onJobUpdate()
        setSelectedJob(null)
      }
    } catch (error) {
      console.error('Error assigning job:', error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleStatusUpdate = async (jobId: string, status: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        onJobUpdate()
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Jobs</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <div key={job.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Customer:</strong> {job.customerName}</p>
                  <p><strong>Location:</strong> {job.location.address}, {job.location.city}, {job.location.state}</p>
                  {job.technician && (
                    <p><strong>Assigned to:</strong> {job.technician.name}</p>
                  )}
                  {job.scheduledAt && (
                    <p><strong>Scheduled:</strong> {new Date(job.scheduledAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!job.technician && job.status === 'PENDING' && (
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Assign
                  </button>
                )}
                
                {job.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleStatusUpdate(job.id, 'IN_PROGRESS')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Start
                  </button>
                )}
                
                {job.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusUpdate(job.id, 'COMPLETED')}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Assign Job: {selectedJob.title}</h3>
            
            <div className="space-y-3">
              {technicians.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleAssignJob(selectedJob.id, tech.id)}
                  disabled={isAssigning}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-sm text-gray-600">{tech.email}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}