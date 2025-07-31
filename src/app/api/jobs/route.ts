import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  customerId: z.string().min(1, 'Customer ID is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  latitude: z.number(),
  longitude: z.number(),
  scheduledAt: z.string().datetime().optional(),
  estimatedDuration: z.number().optional()
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const technicianId = searchParams.get('technicianId')

  const jobs = await prisma.job.findMany({
    where: {
      ...(status && { status: status as 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }),
      ...(technicianId && { technicianId })
    },
    include: {
      location: true,
      technician: true,
      dispatchLogs: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(jobs)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DISPATCHER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = createJobSchema.parse(body)

    const location = await prisma.location.create({
      data: {
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude
      }
    })

    const job = await prisma.job.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        customerId: validatedData.customerId,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerEmail: validatedData.customerEmail,
        locationId: location.id,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        estimatedDuration: validatedData.estimatedDuration
      },
      include: {
        location: true,
        technician: true
      }
    })

    await prisma.dispatchLog.create({
      data: {
        jobId: job.id,
        action: 'CREATED',
        details: 'Job created'
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}