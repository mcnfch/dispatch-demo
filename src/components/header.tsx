'use client'

/**
 * Header Component
 * 
 * Displays the application header with centered branding including:
 * - Dispatch demo icon (PNG from public folder)
 * - Application title "Dispatch Demo"
 * 
 * Used across all pages for consistent branding and navigation.
 * The icon is served from the public folder and excluded from auth middleware.
 */
export default function Header() {
  return (
    <div className="bg-white border-b shadow-sm">
      {/* Main container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered flex container for branding elements */}
        <div className="flex items-center justify-center py-6">
          <div className="flex flex-col items-center space-y-2">
            {/* Icon container with fixed dimensions */}
            <div className="w-16 h-16">
              <img
                src="/android-chrome-512x512.png"
                alt="Dispatch Demo Icon"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            {/* Application title */}
            <h1 className="text-2xl font-bold text-gray-900">
              Dispatch Demo
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}