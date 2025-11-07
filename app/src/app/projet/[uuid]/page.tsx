'use client'

import { useParams } from "next/navigation"
import { AuthenticatedLayout } from "../../../components/layouts/AuthenticatedLayout"
import ProjectDetail from "@/src/features/projects/components/ProjectDetail";

export default function Projects() {
  const params = useParams()

  return (
    <AuthenticatedLayout>  
      <ProjectDetail projectUuid={params.uuid as string} />
    </AuthenticatedLayout>
  )
}