'use client'

import { AuthenticatedLayout } from "../../../components/layouts/AuthenticatedLayout"
import NewProjectForm from "@/src/features/project/components/NewProjectForm"

export default function Projects() {
  return (
    <AuthenticatedLayout>  
      <title>Créer un audit - Ohdit</title>
      <h1 className="h1 mb-10">Créer un audit</h1>
      <NewProjectForm />
    </AuthenticatedLayout>
  )
}