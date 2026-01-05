'use client'

import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    // Deleting the auth token cookie
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict'
    window.localStorage.clear()
    window.location.href = '/login'  
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-4xl text-center">En cours de déconnexion...</p>
    </div>
  )
}