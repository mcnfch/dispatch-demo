import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateJobSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  technicianId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  estimatedDuration: z.number().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      location: true,
      technician: true,
      dispatchLogs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json(job)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const validatedData = updateJobSchema.parse(body)

    const existingJob = await prisma.job.findUnique({
      where: { id }
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    let logAction = null
    let logDetails = ''

    if (validatedData.status && validatedData.status !== existingJob.status) {
      updateData.status = validatedData.status
      logAction = validatedData.status === 'COMPLETED' ? 'COMPLETED' : 
                  validatedData.status === 'CANCELLED' ? 'CANCELLED' :
                  validatedData.status === 'IN_PROGRESS' ? 'STARTED' : null
      logDetails = `Status changed to ${validatedData.status}`
      
      if (validatedData.status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (validatedData.technicianId && validatedData.technicianId !== existingJob.technicianId) {
      updateData.technicianId = validatedData.technicianId
      updateData.status = 'ASSIGNED'
      logAction = existingJob.technicianId ? 'REASSIGNED' : 'ASSIGNED'
      logDetails = `Job ${existingJob.technicianId ? 'reassigned' : 'assigned'} to technician`
    }

    if (validatedData.scheduledAt) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt)
    }

    if (validatedData.estimatedDuration) {
      updateData.estimatedDuration = validatedData.estimatedDuration
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        technician: true
      }
    })

    if (logAction) {
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: logAction as 'ASSIGNED' | 'REASSIGNED' | 'STARTED' | 'COMPLETED' | 'CANCELLED',
          details: logDetails
        }
      })
    }

    return NextResponse.json(job)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DISPATCHER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.job.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}