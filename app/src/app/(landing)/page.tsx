'use client'

import RuleSetGrid from "@/src/features/rule_set/components/grid/RuleSetGrid"
import { MainLayout } from "../../components/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center">
        <RuleSetGrid />
      </main>
    </MainLayout>
  )
}