'use client'

import { useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface Job {
  id: string
  title: string
  status: string
  priority: string
  customerName: string
  scheduledAt?: string
  estimatedDuration?: number
  technician?: {
    name: string
  }
}

interface CalendarViewProps {
  jobs: Job[]
  onJobUpdate: () => void
}

export default function CalendarView({ jobs }: CalendarViewProps) {
  const events = useMemo(() => {
    return jobs
      .filter(job => job.scheduledAt)
      .map(job => {
        const start = new Date(job.scheduledAt!)
        const end = job.estimatedDuration 
          ? new Date(start.getTime() + (job.estimatedDuration * 60 * 1000))
          : new Date(start.getTime() + (60 * 60 * 1000)) // Default 1 hour

        return {
          id: job.id,
          title: `${job.title} - ${job.customerName}`,
          start,
          end,
          resource: job
        }
      })
  }, [jobs])

  const eventStyleGetter = (event: { resource: Job }) => {
    const job = event.resource
    let backgroundColor = '#3174ad'

    switch (job.status) {
      case 'PENDING':
        backgroundColor = '#f59e0b'
        break
      case 'ASSIGNED':
        backgroundColor = '#3b82f6'
        break
      case 'IN_PROGRESS':
        backgroundColor = '#10b981'
        break
      case 'COMPLETED':
        backgroundColor = '#6b7280'
        break
      case 'CANCELLED':
        backgroundColor = '#ef4444'
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const handleSelectEvent = (event: { resource: Job }) => {
    const job = event.resource
    console.log('Selected job:', job)
    // Could open a modal or navigate to job details
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Scheduled Jobs</h2>
      </div>
      
      <div className="p-6">
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="week"
            popup
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Assigned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  )
}