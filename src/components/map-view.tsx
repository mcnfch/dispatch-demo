'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface Job {
  id: string
  title: string
  status: string
  priority: string
  customerName: string
  location: {
    address: string
    city: string
    state: string
    latitude: number
    longitude: number
  }
  technician?: {
    name: string
  }
}

interface MapViewProps {
  jobs: Job[]
  technicians: unknown[]
  onJobUpdate: () => void
}

export default function MapView({ jobs }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    )
  }

  // Marker colors handled by CSS classes

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Job Locations</h2>
      </div>
      
      <div className="p-6">
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[40.7128, -74.0060]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {jobs.map((job) => (
              <Marker
                key={job.id}
                position={[job.location.latitude, job.location.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> {job.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Priority:</strong> {job.priority}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Customer:</strong> {job.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Address:</strong> {job.location.address}, {job.location.city}
                    </p>
                    {job.technician && (
                      <p className="text-sm text-gray-600">
                        <strong>Technician:</strong> {job.technician.name}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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