# Dispatch Demo - Hybrid Scheduling & Dispatch System

A fully functional demonstration of a modern scheduling and dispatch application built from scratch. This project showcases a complete end-to-end implementation including database design, API development, authentication, and multiple UI views.

## 🌐 Live Demo

**Live Application:** https://dispatch.forbush.biz

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

### Local Installation

1. **Clone and setup**
   ```bash
   git clone git@github.com:mcnfch/dispatch-demo.git
   cd dispatch-demo
   npm install
   ```

2. **Start the database**
   ```bash
   docker compose up -d postgres
   ```

3. **Setup the database**
   ```bash
   npx prisma migrate dev
   npm run demo:load
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3333`

## 📋 What Was Built

This project demonstrates a complete dispatch application built from the ground up, including:

### ✅ Infrastructure & Setup
- **Next.js 15** application with TypeScript and App Router
- **PostgreSQL** database with Docker containerization (port 5433 to avoid conflicts)
- **Prisma ORM** with comprehensive schema design and migrations
- **Production deployment** with Nginx reverse proxy and SSL/TLS certificates
- **Systemd service** configuration for reliable application management

### ✅ Database Architecture
- **User Management**: Role-based system (Admin, Dispatcher, Technician)
- **Job Management**: Complete work order system with customer information
- **Location Tracking**: GPS coordinates for mapping functionality
- **Audit Trail**: Complete dispatch logs for all job changes
- **Authentication Tables**: NextAuth.js integration with Prisma adapter

### ✅ Backend API
- **RESTful API Design**: Clean, consistent endpoints following REST principles
- **Authentication & Authorization**: Session-based auth with role-based access control
- **Input Validation**: Server-side validation using Zod schemas
- **Error Handling**: Comprehensive error responses and logging
- **Database Operations**: Optimized queries with proper relationships

### ✅ Frontend Implementation
- **Dashboard Interface**: Clean, professional UI with Tailwind CSS
- **Three View Modes**: 
  - **List View**: Tabular job management with filtering and actions
  - **Map View**: Interactive map using React Leaflet showing job locations
  - **Calendar View**: Scheduled jobs displayed using React Big Calendar
- **Real-time Updates**: Job status changes and assignments
- **Responsive Design**: Mobile-friendly interface
- **Role-based UI**: Different views and actions based on user permissions

### ✅ Advanced Features
- **Auto-dispatch Algorithm**: Intelligent job assignment to available technicians
- **Manual Assignment**: Drag-and-drop or click-to-assign functionality
- **Status Workflow**: Pending → Assigned → In Progress → Completed
- **Priority Management**: Urgent, High, Medium, Low priority levels
- **Geographic Mapping**: Real-world NYC locations with coordinates
- **Form Validation**: Client and server-side validation

### ✅ Production Deployment
- **SSL/TLS Security**: Let's Encrypt certificates with automatic renewal
- **Nginx Configuration**: Optimized reverse proxy with security headers
- **Production Build**: Optimized Next.js build with static generation
- **Service Management**: Systemd service for automatic startup and monitoring
- **Domain Configuration**: Custom domain with proper DNS setup

## 🔐 Demo Login Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@dispatch.com | password | Full system access |
| Dispatcher | dispatcher@dispatch.com | password | Job management & assignment |
| Technician | tech1@dispatch.com | password | John Smith - Field technician |
| Technician | tech2@dispatch.com | password | Maria Garcia - Field technician |
| Technician | tech3@dispatch.com | password | David Kim - Field technician |
| Technician | tech4@dispatch.com | password | Emily Johnson - Field technician |

## 🎯 Features

### Core Functionality
- **Job Management**: Create, assign, and track service jobs
- **User Roles**: Admin, Dispatcher, and Technician access levels
- **Real-time Updates**: Job status changes and assignments
- **Location Tracking**: GPS coordinates for job locations

### Views & Interfaces
- **List View**: Tabular job management with filtering
- **Map View**: Interactive map showing job locations (using Leaflet)
- **Calendar View**: Scheduled jobs in calendar format (using React Big Calendar)

### Dispatch Features
- **Manual Assignment**: Assign jobs to specific technicians
- **Auto Dispatch**: Basic algorithm for automatic job assignment
- **Priority Management**: Urgent, High, Medium, Low priority levels
- **Status Tracking**: Pending → Assigned → In Progress → Completed

## 🛠 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Leaflet** - Interactive maps
- **React Big Calendar** - Calendar component

### Backend
- **Next.js API Routes** - RESTful API
- **NextAuth.js** - Authentication
- **Prisma** - Database ORM
- **Zod** - Input validation

### Database
- **PostgreSQL** - Primary database
- **Docker** - Containerized database

## 📂 Project Structure

```
dispatch/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   └── page.tsx      # Main dashboard
│   ├── components/       # React components
│   └── lib/             # Utilities and configurations
├── scripts/
│   └── load-demo-data.ts # Demo data loader
└── docker-compose.yml   # Database container
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run demo:load       # Load demo data
npm run demo:reset      # Reset DB and reload demo data
npx prisma studio       # Open database browser
npx prisma migrate dev  # Run database migrations

# Maintenance
npm run lint            # Run ESLint
```

## 📊 Demo Data

The application comes with realistic demo data including:

- **6 Users**: 1 Admin, 1 Dispatcher, 4 Technicians
- **8 Locations**: Spread across NYC (Manhattan, Brooklyn, Queens)
- **10 Jobs**: Various priorities and statuses
- **Complete Audit Trail**: Dispatch logs for all job changes

### Job Examples
- Emergency heating system failure (Urgent)
- Water main break with flooding (Urgent) 
- Elevator out of service (High)
- HVAC maintenance (Medium)
- LED light replacement (Low)
- Completed jobs for history

## 🏗 Architecture Highlights

### Database Design
- **Users**: Role-based access (Admin/Dispatcher/Technician)
- **Jobs**: Core work orders with customer info
- **Locations**: GPS coordinates for mapping
- **Dispatch Logs**: Complete audit trail
- **NextAuth Tables**: Session management

### API Design
- RESTful endpoints for CRUD operations
- Role-based authorization middleware
- Input validation with Zod schemas
- Proper error handling and logging

### Frontend Architecture
- Server-side rendering with Next.js App Router
- Client-side state management
- Responsive design with Tailwind CSS
- Real-time UI updates

## 🔒 Security Features

- **Authentication**: Session-based with NextAuth.js
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation with Zod
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🚨 Limitations (Prototype)

This is a demonstration prototype with the following limitations:

- **Simplified Authentication**: Demo users with basic password auth
- **Mock Geocoding**: Random coordinates instead of real geocoding API
- **Basic Dispatch Algorithm**: Simple nearest-first assignment
- **No Real-time WebSockets**: Manual refresh for updates
- **Limited Error Handling**: Basic error management
- **No Production Deployment**: Development setup only

## 🏗 Implementation Details

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js authentication
- **Database**: PostgreSQL with Prisma ORM
- **Mapping**: React Leaflet with OpenStreetMap tiles
- **Calendar**: React Big Calendar with Moment.js
- **Validation**: Zod for schema validation
- **Deployment**: Nginx, SSL/TLS, Systemd services

### Architecture Decisions
- **App Router**: Utilized Next.js 15's latest App Router for improved performance
- **Server Components**: Leveraged React Server Components where appropriate
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Database Design**: Normalized schema with proper relationships and constraints
- **Security**: Role-based access control with session-based authentication
- **Deployment**: Production-ready setup with proper SSL and service management

### Development Process
- **Incremental Development**: Built feature by feature with working prototypes
- **Database-First Design**: Started with comprehensive schema design
- **API-First Approach**: Developed and tested API endpoints before frontend integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Production Deployment**: Configured for real-world hosting with proper security

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run demo:load       # Load demo data
npm run demo:reset      # Reset DB and reload demo data
npx prisma studio       # Open database browser
npx prisma migrate dev  # Run database migrations

# Maintenance
npm run lint            # Run ESLint
```

## 🎯 Future Enhancements

This demonstration could be extended with:

### Advanced Features
- Real-time WebSocket updates for live job status
- Advanced routing optimization with external APIs
- Mobile application for field technicians
- Customer portal for job requests and status
- SMS/Email notification system
- File attachments and photo uploads
- GPS tracking for technicians
- Advanced reporting and analytics

### Enterprise Features
- Multi-tenant architecture
- Advanced scheduling algorithms
- Integration with external systems (CRM, ERP)
- Advanced user permissions and workflows
- Audit trails and compliance features
- Performance monitoring and alerting

## 📊 Demo Data

The application includes realistic demonstration data:
- **6 Users**: Admin, Dispatcher, and 4 Technicians
- **8 Locations**: Real NYC addresses with GPS coordinates
- **10 Jobs**: Various priorities, statuses, and scenarios
- **Complete History**: Full audit trail of all job changes

## 📄 License

This is a demonstration project showcasing full-stack web development capabilities.
