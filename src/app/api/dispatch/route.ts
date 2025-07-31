import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Basic dispatch algorithm - assign to nearest available technician
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DISPATCHER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { location: true }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'PENDING') {
      return NextResponse.json({ error: 'Job is not in pending status' }, { status: 400 })
    }

    // Get available technicians (not currently assigned to active jobs)
    const availableTechnicians = await prisma.user.findMany({
      where: {
        role: 'TECHNICIAN',
        OR: [
          { jobs: { none: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } } },
          { jobs: { every: { status: { notIn: ['ASSIGNED', 'IN_PROGRESS'] } } } }
        ]
      }
    })

    if (availableTechnicians.length === 0) {
      return NextResponse.json({ error: 'No available technicians' }, { status: 400 })
    }

    // Simple algorithm: assign to first available technician
    // In a real implementation, you'd consider:
    // - Distance from technician's current location
    // - Technician skills/specializations
    // - Current workload
    // - Route optimization
    const selectedTechnician = availableTechnicians[0]

    // Update job with assigned technician
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        technicianId: selectedTechnician.id,
        status: 'ASSIGNED'
      },
      include: {
        location: true,
        technician: true
      }
    })

    // Log the assignment
    await prisma.dispatchLog.create({
      data: {
        jobId: job.id,
        action: 'ASSIGNED',
        details: `Auto-assigned to ${selectedTechnician.name} using basic dispatch algorithm`
      }
    })

    return NextResponse.json({
      message: 'Job successfully assigned',
      job: updatedJob,
      technician: selectedTechnician
    })

  } catch (error) {
    console.error('Dispatch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Batch dispatch for multiple jobs
export async function PATCH() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DISPATCHER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all pending jobs
    const pendingJobs = await prisma.job.findMany({
      where: { status: 'PENDING' },
      include: { location: true },
      orderBy: [
        { priority: 'desc' }, // High priority first
        { createdAt: 'asc' }   // Then first-come-first-served
      ]
    })

    if (pendingJobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs to dispatch', assignments: [] })
    }

    // Get available technicians
    const availableTechnicians = await prisma.user.findMany({
      where: {
        role: 'TECHNICIAN',
        OR: [
          { jobs: { none: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } } },
          { jobs: { every: { status: { notIn: ['ASSIGNED', 'IN_PROGRESS'] } } } }
        ]
      }
    })

    if (availableTechnicians.length === 0) {
      return NextResponse.json({ error: 'No available technicians' }, { status: 400 })
    }

    const assignments = []
    let technicianIndex = 0

    // Simple round-robin assignment
    for (const job of pendingJobs) {
      if (technicianIndex >= availableTechnicians.length) {
        break // No more available technicians
      }

      const technician = availableTechnicians[technicianIndex]

      // Update job
      await prisma.job.update({
        where: { id: job.id },
        data: {
          technicianId: technician.id,
          status: 'ASSIGNED'
        }
      })

      // Log the assignment
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'ASSIGNED',
          details: `Batch assigned to ${technician.name}`
        }
      })

      assignments.push({
        jobId: job.id,
        jobTitle: job.title,
        technicianId: technician.id,
        technicianName: technician.name
      })

      technicianIndex++
    }

    return NextResponse.json({
      message: `Successfully assigned ${assignments.length} jobs`,
      assignments
    })

  } catch (error) {
    console.error('Batch dispatch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}