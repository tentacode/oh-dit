'use client'

import { AuthenticatedLayout } from "../../../components/layouts/AuthenticatedLayout"
import NewProjectForm from "@/src/features/projects/components/NewProjectForm"

export default function Projects() {
  return (
    <AuthenticatedLayout>  
      <h1 className="mb-10">Créer un audit</h1>
      <NewProjectForm />
    </AuthenticatedLayout>
  )
}