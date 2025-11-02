import Link from 'next/link'
import { useState } from 'react'

type Props = {
  user?: { name?: string; role?: string }
}

export default function Header({ user }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            School<span className="text-gray-800">Mgmt</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4 ml-6 text-sm text-gray-700">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <Link href="/courses" className="hover:text-indigo-600">Courses</Link>
            <Link href="/students" className="hover:text-indigo-600">Students</Link>
            <Link href="/teachers" className="hover:text-indigo-600">Teachers</Link>
            <Link href="/exams" className="hover:text-indigo-600">Exams</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1 text-sm rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">{user.role}</span>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block">Home</Link>
            <Link href="/courses" className="block">Courses</Link>
            <Link href="/students" className="block">Students</Link>
            <Link href="/teachers" className="block">Teachers</Link>
            <Link href="/exams" className="block">Exams</Link>
            {!user && (
              <>
                <Link href="/auth/login" className="block">Login</Link>
                <Link href="/auth/signup" className="block">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
