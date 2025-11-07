'use client'

import ProjectGrid from "@/src/features/projects/components/ProjectGrid"
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout"

export default function Projects() {
  return (
    <AuthenticatedLayout>  
      <h1>Vos projets</h1>
      <ProjectGrid />
    </AuthenticatedLayout>
  )
}