import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

/**
 * NextAuth Configuration
 * 
 * Configures authentication for the dispatch application with:
 * - Credential-based authentication (email/password)
 * - JWT session strategy for stateless authentication
 * - Role-based access control (ADMIN, DISPATCHER, TECHNICIAN)
 * - Custom callbacks for token and session management
 * 
 * Demo accounts are hardcoded for testing purposes with 'password' as the universal password.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      /**
       * Authorize function for credential validation
       * @param credentials - User provided email and password
       * @returns User object if valid, null if invalid
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo users with different roles for testing
        // In production, this would query a database with hashed passwords
        const users = [
          { id: '1', email: 'admin@dispatch.com', name: 'Admin User', role: 'ADMIN' },
          { id: '2', email: 'dispatcher@dispatch.com', name: 'Dispatcher', role: 'DISPATCHER' },
          { id: '3', email: 'tech@dispatch.com', name: 'Technician', role: 'TECHNICIAN' }
        ]

        const user = users.find(u => u.email === credentials.email)
        
        // Simple password check for demo (all accounts use 'password')
        if (user && credentials.password === 'password') {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }

        return null
      }
    })
  ],
  
  // Use JWT for stateless sessions
  session: {
    strategy: 'jwt'
  },
  
  callbacks: {
    /**
     * JWT callback - called when JWT is created
     * Adds user role to the token for role-based access control
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
      }
      return token
    },
    
    /**
     * Session callback - called when session is accessed
     * Adds user ID and role to the session object
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  
  // Custom sign-in page
  pages: {
    signIn: '/auth/signin'
  }
}