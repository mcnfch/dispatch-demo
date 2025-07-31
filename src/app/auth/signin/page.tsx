'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * SignIn Page Component
 * 
 * Authentication page for the dispatch application featuring:
 * - Email/password credential login
 * - Demo account information display
 * - Error handling for invalid credentials
 * - Redirect to dashboard on successful login
 * 
 * Uses NextAuth for authentication with credential provider.
 * Demo accounts are provided for testing different user roles.
 */
export default function SignIn() {
  // Form state management
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  /**
   * Handles form submission for user authentication
   * Attempts to sign in with provided credentials and redirects on success
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Attempt authentication with NextAuth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      // Redirect to dashboard on successful authentication
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content container with centered layout */}
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Page title */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to Dispatch
            </h2>
          </div>
          
          {/* Login form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password input field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error message display */}
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>

            {/* Demo account information */}
            <div className="text-sm text-gray-600 text-center">
              <p>Demo accounts:</p>
              <p>admin@dispatch.com / password</p>
              <p>dispatcher@dispatch.com / password</p>
              <p>tech@dispatch.com / password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}