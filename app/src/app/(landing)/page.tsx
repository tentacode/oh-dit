'use client'

import { MainLayout } from "../../components/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br">
        <h1 className="text-4xl font-bold font-heading text-gray-900">
          Bienvenue sur Oh Dit
        </h1>
      </main>
    </MainLayout>
  )
}