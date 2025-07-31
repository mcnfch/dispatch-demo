'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 relative">
              <Image
                src="/dispatch-icon.svg"
                alt="Dispatch Demo Icon"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dispatch Demo
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}