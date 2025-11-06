'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    // Deleting the auth token cookie
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict'
    router.push('/login')
  }, [router])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-4xl text-center">En cours de déconnexion...</p>
    </div>
  )
}