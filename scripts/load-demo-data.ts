#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function loadDemoData() {
  console.log('🚀 Loading demo data for dispatch application...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.dispatchLog.deleteMany()
    await prisma.job.deleteMany()
    await prisma.location.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()

    // Create demo users
    console.log('👥 Creating demo users...')
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@dispatch.com',
          name: 'Admin User',
          role: 'ADMIN'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dispatcher@dispatch.com',
          name: 'Sarah Wilson',
          role: 'DISPATCHER'
        }
      }),
      prisma.user.create({
        data: {
          email: 'tech1@dispatch.com',
          name: 'John Smith',
          role: 'TECHNICIAN'
        }
      }),
      prisma.user.create({
        data: {
          email: 'tech2@dispatch.com',
          name: 'Maria Garcia',
          role: 'TECHNICIAN'
        }
      }),
      prisma.user.create({
        data: {
          email: 'tech3@dispatch.com',
          name: 'David Kim',
          role: 'TECHNICIAN'
        }
      }),
      prisma.user.create({
        data: {
          email: 'tech4@dispatch.com',
          name: 'Emily Johnson',
          role: 'TECHNICIAN'
        }
      })
    ])

    const [admin, dispatcher, tech1, tech2, tech3, tech4] = users
    console.log(`✅ Created ${users.length} users`)

    // Create demo locations across NYC
    console.log('📍 Creating demo locations...')
    const locations = await Promise.all([
      // Manhattan locations
      prisma.location.create({
        data: {
          address: '350 5th Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10118',
          latitude: 40.7484,
          longitude: -73.9857
        }
      }),
      prisma.location.create({
        data: {
          address: '200 West St',
          city: 'New York',
          state: 'NY',
          zipCode: '10282',
          latitude: 40.7155,
          longitude: -74.0135
        }
      }),
      prisma.location.create({
        data: {
          address: '1633 Broadway',
          city: 'New York',
          state: 'NY',
          zipCode: '10019',
          latitude: 40.7615,
          longitude: -73.9847
        }
      }),
      prisma.location.create({
        data: {
          address: '11 Wall St',
          city: 'New York',
          state: 'NY',
          zipCode: '10005',
          latitude: 40.7074,
          longitude: -74.0113
        }
      }),
      // Brooklyn locations
      prisma.location.create({
        data: {
          address: '625 Atlantic Ave',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11217',
          latitude: 40.6892,
          longitude: -73.9714
        }
      }),
      prisma.location.create({
        data: {
          address: '1 MetroTech Center',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          latitude: 40.6928,
          longitude: -73.9857
        }
      }),
      // Queens locations
      prisma.location.create({
        data: {
          address: '23-01 44th Dr',
          city: 'Long Island City',
          state: 'NY',
          zipCode: '11101',
          latitude: 40.7505,
          longitude: -73.9426
        }
      }),
      prisma.location.create({
        data: {
          address: '3040 Northern Blvd',
          city: 'Long Island City',
          state: 'NY',
          zipCode: '11101',
          latitude: 40.7538,
          longitude: -73.9077
        }
      })
    ])
    console.log(`✅ Created ${locations.length} locations`)

    // Create demo jobs with realistic scenarios
    console.log('🔧 Creating demo jobs...')
    const now = new Date()
    const oneHour = 60 * 60 * 1000
    const oneDay = 24 * oneHour

    const jobsData = [
      // Urgent jobs
      {
        title: 'Emergency - No Heat in Office Building',
        description: 'Heating system completely down in 20-story office building. 500+ employees affected. Need immediate response.',
        priority: 'URGENT',
        customerId: 'EMRG001',
        customerName: 'Manhattan Corporate Tower',
        customerPhone: '(212) 555-0101',
        customerEmail: 'emergency@mctower.com',
        locationId: locations[0].id,
        scheduledAt: new Date(now.getTime() + oneHour),
        estimatedDuration: 240,
        status: 'PENDING'
      },
      {
        title: 'Water Main Break - Basement Flooding',
        description: 'Major water leak in basement causing flooding. Water shut off needed immediately.',
        priority: 'URGENT',
        customerId: 'EMRG002',
        customerName: 'Downtown Medical Center',
        customerPhone: '(212) 555-0102',
        customerEmail: 'facilities@dmc.org',
        locationId: locations[1].id,
        technicianId: tech1.id,
        scheduledAt: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
        estimatedDuration: 180,
        status: 'ASSIGNED'
      },
      
      // High priority jobs
      {
        title: 'Elevator Out of Service',
        description: 'Main passenger elevator stuck between floors. Building has multiple floors with disabled access needs.',
        priority: 'HIGH',
        customerId: 'HIGH001',
        customerName: 'Times Square Office Complex',
        customerPhone: '(212) 555-0201',
        customerEmail: 'maintenance@tsoc.com',
        locationId: locations[2].id,
        technicianId: tech2.id,
        scheduledAt: new Date(now.getTime() + 2 * oneHour),
        estimatedDuration: 120,
        status: 'IN_PROGRESS'
      },
      {
        title: 'Power Outage - Server Room',
        description: 'Partial power loss affecting critical server infrastructure. Backup generators running.',
        priority: 'HIGH',
        customerId: 'HIGH002',
        customerName: 'Financial District Data Center',
        customerPhone: '(212) 555-0202',
        customerEmail: 'ops@fddc.com',
        locationId: locations[3].id,
        scheduledAt: new Date(now.getTime() + 4 * oneHour),
        estimatedDuration: 150,
        status: 'PENDING'
      },

      // Medium priority jobs
      {
        title: 'HVAC Maintenance - Scheduled Service',
        description: 'Quarterly HVAC system maintenance and filter replacement for office building.',
        priority: 'MEDIUM',
        customerId: 'MED001',
        customerName: 'Brooklyn Heights Office Park',
        customerPhone: '(718) 555-0301',
        customerEmail: 'property@bhop.com',
        locationId: locations[4].id,
        technicianId: tech3.id,
        scheduledAt: new Date(now.getTime() + oneDay),
        estimatedDuration: 90,
        status: 'ASSIGNED'
      },
      {
        title: 'Security System Upgrade',
        description: 'Installation of new keycard access system and security cameras.',
        priority: 'MEDIUM',
        customerId: 'MED002',
        customerName: 'MetroTech Business Center',
        customerPhone: '(718) 555-0302',
        customerEmail: 'security@mtbc.net',
        locationId: locations[5].id,
        scheduledAt: new Date(now.getTime() + 2 * oneDay),
        estimatedDuration: 180,
        status: 'PENDING'
      },
      {
        title: 'Plumbing - Kitchen Renovation',
        description: 'Install new commercial-grade kitchen fixtures and update plumbing for restaurant.',
        priority: 'MEDIUM',
        customerId: 'MED003',
        customerName: 'Queens Culinary Institute',
        customerPhone: '(718) 555-0303',
        customerEmail: 'facilities@qci.edu',
        locationId: locations[6].id,
        scheduledAt: new Date(now.getTime() + 3 * oneDay),
        estimatedDuration: 300,
        status: 'PENDING'
      },

      // Low priority jobs
      {
        title: 'Light Fixture Replacement',
        description: 'Replace fluorescent lighting with LED fixtures in office spaces.',
        priority: 'LOW',
        customerId: 'LOW001',
        customerName: 'LIC Creative Studios',
        customerPhone: '(718) 555-0401',
        customerEmail: 'admin@licstudios.com',
        locationId: locations[7].id,
        scheduledAt: new Date(now.getTime() + 5 * oneDay),
        estimatedDuration: 120,
        status: 'PENDING'
      },

      // Completed jobs (for history)
      {
        title: 'Annual Fire Safety Inspection',
        description: 'Complete fire safety system inspection including sprinklers, alarms, and extinguishers.',
        priority: 'HIGH',
        customerId: 'COMP001',
        customerName: 'Manhattan Corporate Tower',
        customerPhone: '(212) 555-0101',
        customerEmail: 'safety@mctower.com',
        locationId: locations[0].id,
        technicianId: tech4.id,
        scheduledAt: new Date(now.getTime() - 2 * oneDay),
        estimatedDuration: 180,
        status: 'COMPLETED',
        completedAt: new Date(now.getTime() - oneDay)
      },
      {
        title: 'Network Cable Installation',
        description: 'Install CAT6 ethernet cables for new office layout.',
        priority: 'MEDIUM',
        customerId: 'COMP002',
        customerName: 'Brooklyn Heights Office Park',
        customerPhone: '(718) 555-0301',
        customerEmail: 'it@bhop.com',
        locationId: locations[4].id,
        technicianId: tech1.id,
        scheduledAt: new Date(now.getTime() - 3 * oneDay),
        estimatedDuration: 240,
        status: 'COMPLETED',
        completedAt: new Date(now.getTime() - 2 * oneDay)
      }
    ]

    const jobs = []
    for (const jobData of jobsData) {
      const job = await prisma.job.create({
        data: jobData as any
      })
      jobs.push(job)

      // Create dispatch logs for each job
      await prisma.dispatchLog.create({
        data: {
          jobId: job.id,
          action: 'CREATED',
          details: 'Job created with demo data'
        }
      })

      if (job.status !== 'PENDING') {
        await prisma.dispatchLog.create({
          data: {
            jobId: job.id,
            action: 'ASSIGNED',
            details: `Job assigned to technician`
          }
        })
      }

      if (job.status === 'IN_PROGRESS') {
        await prisma.dispatchLog.create({
          data: {
            jobId: job.id,
            action: 'STARTED',
            details: 'Technician started working on job'
          }
        })
      }

      if (job.status === 'COMPLETED') {
        await prisma.dispatchLog.create({
          data: {
            jobId: job.id,
            action: 'STARTED',
            details: 'Technician started working on job'
          }
        })
        await prisma.dispatchLog.create({
          data: {
            jobId: job.id,
            action: 'COMPLETED',
            details: 'Job completed successfully'
          }
        })
      }
    }

    console.log(`✅ Created ${jobs.length} jobs with dispatch logs`)

    // Summary
    console.log('\n📊 Demo Data Summary:')
    console.log(`• ${users.length} users (1 admin, 1 dispatcher, 4 technicians)`)
    console.log(`• ${locations.length} locations across NYC`)
    console.log(`• ${jobs.length} jobs with various statuses and priorities`)
    console.log(`• Complete dispatch log history`)
    
    console.log('\n🔐 Login Credentials:')
    console.log('• admin@dispatch.com / password (Admin)')
    console.log('• dispatcher@dispatch.com / password (Dispatcher)')
    console.log('• tech1@dispatch.com / password (Technician - John Smith)')
    console.log('• tech2@dispatch.com / password (Technician - Maria Garcia)')
    console.log('• tech3@dispatch.com / password (Technician - David Kim)')
    console.log('• tech4@dispatch.com / password (Technician - Emily Johnson)')

    console.log('\n🎯 Demo Features:')
    console.log('• Job creation and assignment')
    console.log('• Real-time status updates')
    console.log('• Map view with job locations')
    console.log('• Calendar view with scheduled jobs')
    console.log('• Basic dispatch algorithm')
    console.log('• Role-based access control')

    console.log('\n✨ Demo data loaded successfully!')

  } catch (error) {
    console.error('❌ Error loading demo data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
loadDemoData()