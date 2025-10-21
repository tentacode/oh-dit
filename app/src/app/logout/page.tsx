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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-4xl text-gray-900">Déconnexion en cours...</p>
    </div>
  )
}