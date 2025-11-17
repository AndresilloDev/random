"use client"

import { useParams } from "next/navigation"

export default function ManageEventPage() {
  const params = useParams()
  const id = params.id // El ID del evento

  return (
    <div>
      <h1>Gestionar Ponencia {id}</h1>
      {/* Aquí puedes renderizar los controles de gestión del evento */}
    </div>
  )
}