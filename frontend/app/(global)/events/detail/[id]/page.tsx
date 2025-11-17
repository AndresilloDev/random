"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/useAuth"
import { Calendar, MapPin, User, Clock, Users, GraduationCap, Download, X, Upload } from 'lucide-react'
import api from "@/lib/api"

interface Event {
  _id: string
  title: string
  description: string
  capacity: number
  duration: number
  modality: "in-person" | "online" | "hybrid"
  date: string
  presenter: string
  location?: string
  link?: string
  requirements: string[]
  type: "workshop" | "conference" | "seminar"
  attendees?: string[]
  createdAt: string
  updatedAt: string
}

interface Material {
  id: string
  name: string
  type: "pptx" | "xlsx" | "pdf" | "docx"
  uploadDate: string
  url: string
}

export default function EventDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { user, loading: loadingAuth } = useAuth()

  const [event, setEvent] = useState<Event | null>(null)
  const [presenter, setPresenter] = useState<any>(null)
  const [loadingEvent, setLoadingEvent] = useState(true)

  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [changed, setChanged] = useState(false)
  const [materials, setMaterials] = useState<Material[]>([])

  useEffect(() => {
    if (!id) return

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`)
        const ev = res.data.value

        setEvent(ev)
        setDescription(ev.description || "")
        setRequirements(ev.requirements?.join("\n") || "")

        if (ev.presenter) {
          const p = await api.get(`/users/${ev.presenter}`)
          setPresenter(p.data.value)
        }

        setMaterials([
          {
            id: "1",
            name: "Presentación NodeJS.pptx",
            type: "pptx",
            uploadDate: "15 de Octubre de 2025",
            url: "#",
          },
          {
            id: "2",
            name: "Datos NodeJS.xlsx",
            type: "xlsx",
            uploadDate: "15 de Octubre de 2025",
            url: "#",
          },
        ])
      } catch (err) {
        console.error("Error cargando evento:", err)
      } finally {
        setLoadingEvent(false)
      }
    }

    fetchEvent()
  }, [id])

  // Determinar permisos y botones según el rol del usuario
  const isAdmin = user?.role === "admin"
  const isPresenter = user?.role === "presenter" && user?.id === event?.presenter
  const isAttendee = user?.role === "attendee"
  const canEdit = isPresenter

  const getMaterialIcon = (type: string) => {
    const icons: Record<string, { bg: string; icon: string }> = {
      pptx: { bg: "bg-orange-500", icon: "P" },
      xlsx: { bg: "bg-green-500", icon: "X" },
      pdf: { bg: "bg-red-500", icon: "PDF" },
      docx: { bg: "bg-blue-500", icon: "W" },
    }
    return icons[type] || icons.pdf
  }

  const removeMaterial = (materialId: string) => {
    setMaterials(materials.filter((m) => m.id !== materialId))
    setChanged(true)
  }

  const handleSaveChanges = async () => {
    try {
      await api.put(`/events/${id}`, {
        description,
        requirements: requirements.split("\n").map((r) => r.trim()).filter((r) => r !== ""),
      })
      setChanged(false)
      alert("Cambios guardados exitosamente")
    } catch (err) {
      console.error("Error guardando cambios:", err)
      alert("Error al guardar los cambios")
    }
  }

  const handleEnroll = async () => {
    try {
      await api.post(`/events/${id}/enroll`)
      alert("¡Te has inscrito exitosamente!")
      const res = await api.get(`/events/${id}`)
      setEvent(res.data.value)
    } catch (err) {
      console.error("Error al inscribirse:", err)
      alert("Error al inscribirse")
    }
  }

  if (loadingAuth || loadingEvent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl">Evento no encontrado</p>
      </div>
    )
  }

  const dateFormatted = new Date(event.date).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const hourFormatted = new Date(event.date).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-700"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
              e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
            }}
          >
            <div
              className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-2xl"
              style={{
                background:
                  "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 40%)",
              }}
            />
            <div className="relative z-10 w-full h-[350px]">
              <img src="/event-presentation-screen.jpg" alt="Event preview" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">{event.title}</h1>

              <div className="space-y-3">
                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-hidden transition-all duration-300 hover:border-gray-700"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }}
                >
                  <div
                    className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.12), transparent 40%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <Calendar className="text-blue-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-white">
                        {dateFormatted} • {hourFormatted}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-hidden transition-all duration-300 hover:border-gray-700"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }}
                >
                  <div
                    className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.12), transparent 40%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <MapPin className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-white">
                      {event.modality === "online" ? event.link : event.location || "Ubicación no especificada"}
                    </p>
                  </div>
                </div>

                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-hidden transition-all duration-300 hover:border-gray-700"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }}
                >
                  <div
                    className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.12), transparent 40%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <User className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-white">
                      Ponente:{" "}
                      {presenter ? `${presenter.first_name} ${presenter.last_name}` : "No disponible"}
                    </p>
                  </div>
                </div>

                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-hidden transition-all duration-300 hover:border-gray-700"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }}
                >
                  <div
                    className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.12), transparent 40%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <GraduationCap className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-white capitalize">Modalidad: {event.modality}</p>
                  </div>
                </div>

                <div
                  className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-hidden transition-all duration-300 hover:border-gray-700"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                  }}
                >
                  <div
                    className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.12), transparent 40%)",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <Users className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-white">
                      Asistentes: {event.attendees?.length || 0} / {event.capacity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones según el rol del usuario */}
            <div className="mt-6">
              {user && (
                <>
                  {/* Admin: puede editar y gestionar asistentes */}
                  {isAdmin && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push(`/events/edit/${event._id}`)}
                        className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => router.push(`/events/attendees/${event._id}`)}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        Gestionar asistentes
                      </button>
                    </div>
                  )}

                  {/* Presenter (dueño del evento): puede guardar cambios y gestionar asistentes */}
                  {isPresenter && (
                    <div className="flex gap-4">
                      <button
                        disabled={!changed}
                        onClick={handleSaveChanges}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          changed
                            ? "bg-white text-black hover:bg-gray-200 hover:shadow-lg hover:shadow-white/20"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                        }`}
                      >
                        Guardar cambios
                      </button>

                      <button
                        onClick={() => router.push(`/events/attendees/${event._id}`)}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        Gestionar asistentes
                      </button>
                    </div>
                  )}

                  {/* Attendee: puede inscribirse */}
                  {isAttendee && (
                    <button
                      onClick={handleEnroll}
                      className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                    >
                      Inscribirse
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6 overflow-hidden transition-all duration-300 hover:border-gray-700"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
          }}
        >
          <div
            className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-2xl"
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Descripción:</h2>
            {canEdit ? (
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setChanged(true)
                }}
                className="w-full bg-gray-950 text-white rounded-xl p-4 border border-gray-800 focus:border-blue-500 focus:outline-none min-h-[150px] resize-y transition-colors duration-300"
                placeholder="Escribe la descripción del evento..."
              />
            ) : (
              <p className="text-gray-300 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div
          className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6 overflow-hidden transition-all duration-300 hover:border-gray-700"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
          }}
        >
          <div
            className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-2xl"
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Requisitos:</h2>
            {canEdit ? (
              <textarea
                value={requirements}
                onChange={(e) => {
                  setRequirements(e.target.value)
                  setChanged(true)
                }}
                className="w-full bg-gray-950 text-white rounded-xl p-4 border border-gray-800 focus:border-blue-500 focus:outline-none min-h-[100px] resize-y transition-colors duration-300"
                placeholder="Escribe los requisitos (uno por línea)..."
              />
            ) : (
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{requirements}</p>
            )}
          </div>
        </div>

        <div
          className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:border-gray-700"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
          }}
        >
          <div
            className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-2xl"
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Material:</h2>
              {canEdit && (
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
                  <Upload size={16} />
                  Subir archivo
                </button>
              )}
            </div>
            <div className="space-y-4">
              {materials.map((material) => {
                const iconData = getMaterialIcon(material.type)
                return (
                  <div
                    key={material.id}
                    className="group/item relative bg-gray-950 rounded-xl p-4 border border-gray-800 flex items-center justify-between hover:border-gray-700 transition-all duration-300 overflow-hidden"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                    }}
                  >
                    <div
                      className="pointer-events-none absolute opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 -inset-px rounded-xl"
                      style={{
                        background:
                          "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.08), transparent 40%)",
                      }}
                    />
                    <div className="relative z-10 flex items-center gap-4">
                      <div
                        className={`${iconData.bg} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                      >
                        {iconData.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{material.name}</p>
                        <p className="text-gray-400 text-sm">Subido el {material.uploadDate}</p>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300">
                        <Download className="text-gray-400 hover:text-white transition-colors" size={20} />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => removeMaterial(material.id)}
                          className="p-2 hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        >
                          <X className="text-gray-400 hover:text-red-400 transition-colors" size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}