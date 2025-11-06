'use client'

import { useParams } from "next/navigation"
import { MainLayout } from "../../../components/layouts/MainLayout"

export default function Projects() {
  const params = useParams()

  return (
    <MainLayout>  
      <h1>Votre audit - {params.uuid}</h1>
    </MainLayout>
  )
}