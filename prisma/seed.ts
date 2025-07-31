import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dispatch.com' },
    update: {},
    create: {
      email: 'admin@dispatch.com',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatcher@dispatch.com' },
    update: {},
    create: {
      email: 'dispatcher@dispatch.com',
      name: 'Dispatcher',
      role: 'DISPATCHER'
    }
  })

  const tech1 = await prisma.user.upsert({
    where: { email: 'tech1@dispatch.com' },
    update: {},
    create: {
      email: 'tech1@dispatch.com',
      name: 'John Smith',
      role: 'TECHNICIAN'
    }
  })

  const tech2 = await prisma.user.upsert({
    where: { email: 'tech2@dispatch.com' },
    update: {},
    create: {
      email: 'tech2@dispatch.com',
      name: 'Sarah Johnson',
      role: 'TECHNICIAN'
    }
  })

  const tech3 = await prisma.user.upsert({
    where: { email: 'tech3@dispatch.com' },
    update: {},
    create: {
      email: 'tech3@dispatch.com',
      name: 'Mike Davis',
      role: 'TECHNICIAN'
    }
  })

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934
      }
    }),
    prisma.location.create({
      data: {
        address: '456 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10013',
        latitude: 40.7214,
        longitude: -74.0052
      }
    }),
    prisma.location.create({
      data: {
        address: '789 Park Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10021',
        latitude: 40.7736,
        longitude: -73.9566
      }
    }),
    prisma.location.create({
      data: {
        address: '321 5th Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10016',
        latitude: 40.7505,
        longitude: -73.9808
      }
    }),
    prisma.location.create({
      data: {
        address: '654 Wall St',
        city: 'New York',
        state: 'NY',
        zipCode: '10005',
        latitude: 40.7074,
        longitude: -74.0113
      }
    })
  ])

  // Create jobs
  const jobs = [
    {
      title: 'AC Repair - Office Building',
      description: 'Central AC unit not cooling properly. Needs immediate attention.',
      priority: 'HIGH',
      customerId: 'CUST001',
      customerName: 'ABC Corporation',
      customerPhone: '(555) 123-4567',
      customerEmail: 'maintenance@abc-corp.com',
      locationId: locations[0].id,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      estimatedDuration: 120,
      status: 'PENDING'
    },
    {
      title: 'Plumbing - Kitchen Sink',
      description: 'Kitchen sink is clogged and water is backing up.',
      priority: 'MEDIUM',
      customerId: 'CUST002',
      customerName: 'Downtown Restaurant',
      customerPhone: '(555) 234-5678',
      customerEmail: 'manager@downtown-restaurant.com',
      locationId: locations[1].id,
      technicianId: tech1.id,
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      estimatedDuration: 90,
      status: 'ASSIGNED'
    },
    {
      title: 'Electrical - Power Outage',
      description: 'Partial power outage in the building. Multiple outlets not working.',
      priority: 'URGENT',
      customerId: 'CUST003',
      customerName: 'Medical Center',
      customerPhone: '(555) 345-6789',
      customerEmail: 'facilities@medical-center.com',
      locationId: locations[2].id,
      technicianId: tech2.id,
      scheduledAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      estimatedDuration: 180,
      status: 'IN_PROGRESS'
    },
    {
      title: 'HVAC Maintenance',
      description: 'Routine maintenance check for HVAC system.',
      priority: 'LOW',
      customerId: 'CUST004',
      customerName: 'Retail Store',
      customerPhone: '(555) 456-7890',
      customerEmail: 'operations@retail-store.com',
      locationId: locations[3].id,
      technicianId: tech3.id,
      scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedDuration: 60,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
      title: 'Security System Check',
      description: 'Annual security system inspection and testing.',
      priority: 'MEDIUM',
      customerId: 'CUST005',
      customerName: 'Law Firm',
      customerPhone: '(555) 567-8901',
      customerEmail: 'admin@law-firm.com',
      locationId: locations[4].id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      estimatedDuration: 150,
      status: 'PENDING'
    }
  ]

  for (const jobData of jobs) {
    const job = await prisma.job.create({
      data: jobData as any
    })

    // Create dispatch logs
    await prisma.dispatchLog.create({
      data: {
        jobId: job.id,
        action: 'CREATED',
        details: 'Job created during seeding'
      }
    })

    if (job.status === 'ASSIGNED') {
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'ASSIGNED',
          details: 'Job assigned during seeding'
        }
      })
    }

    if (job.status === 'IN_PROGRESS') {
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'ASSIGNED',
          details: 'Job assigned during seeding'
        }
      })
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'STARTED',
          details: 'Job started during seeding'
        }
      })
    }

    if (job.status === 'COMPLETED') {
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'ASSIGNED',
          details: 'Job assigned during seeding'
        }
      })
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'STARTED',
          details: 'Job started during seeding'
        }
      })
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'COMPLETED',
          details: 'Job completed during seeding'
        }
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })