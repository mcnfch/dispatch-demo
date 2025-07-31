import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const technicians = await prisma.user.findMany({
    where: {
      role: 'TECHNICIAN'
    },
    select: {
      id: true,
      name: true,
      email: true,
      jobs: {
        where: {
          status: {
            in: ['ASSIGNED', 'IN_PROGRESS']
          }
        },
        select: {
          id: true,
          title: true,
          status: true,
          scheduledAt: true
        }
      }
    }
  })

  return NextResponse.json(technicians)
}