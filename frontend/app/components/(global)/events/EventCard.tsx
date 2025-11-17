"use client"

import { Link, MapPin, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"

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
    createdAt: string
    updatedAt: string
}

const EVENT_TYPE_LABELS: Record<string, string> = {
    workshop: "Taller",
    conference: "Conferencia",
    seminar: "Seminario",
}

const EVENT_TYPE_COLORS: Record<string, string> = {
    workshop: "bg-yellow-500/20 text-yellow-300",
    conference: "bg-blue-500/20 text-blue-300",
    seminar: "bg-purple-500/20 text-purple-300",
}

interface EventCardProps {
    event: Event
    presenterName: string
}

export default function EventCard({ event, presenterName }: EventCardProps) {
    const { user, loading } = useAuth() // Aquí obtenemos el estado del usuario desde el hook useAuth
    const [buttonText, setButtonText] = useState<string>("Ver Detalles")
    const [redirectUrl, setRedirectUrl] = useState<string>("")

    useEffect(() => {
        if (user) {
            // Si el rol del usuario es "admin" o "attendee", el botón será "Ver detalles"
            if (user.role === 'admin' || user.role === 'attendee') {
                setButtonText("Ver Detalles")
                setRedirectUrl(`/events/detail/${event._id}`)
            }

            // Si el rol es "presenter" y el ID del usuario coincide con el ID del ponente, mostramos "Gestionar ponencia"
            if (user.role === 'presenter' && user.id === event.presenter) {
                setButtonText("Gestionar ponencia")
                setRedirectUrl(`/events/detail/${event._id}`)
            }

            if (user.role === 'presenter' && user.id !== event.presenter) {
                setButtonText("Ver Detalles")
                setRedirectUrl(`/events/detail/${event._id}`)
            }
        }
    }, [user, event.presenter]) // Dependemos de "user" y "event.presenter" para actualizar el texto

    if (loading) return <div>Cargando...</div> // Opcional: mensaje de carga mientras obtenemos los datos del usuario

    return (
        <div
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-gray-700 overflow-hidden"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
            }}
        >
            {/* Efecto de hover */}
            <div
                className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-px rounded-2xl"
                style={{
                    background:
                        "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 40%)",
                }}
            />

            <div className="relative z-10 flex gap-6">
                {/* Contenido */}
                <div className="flex-grow space-y-3">
                    {/* Hora */}
                    <p className="text-lg font-base">
                        {new Date(event.date).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    {/* Título y Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <span
                            className={`px-3 py-1 rounded-md text-xs font-semibold ${
                                EVENT_TYPE_COLORS[event.type]
                            }`}
                        >
                            {EVENT_TYPE_LABELS[event.type]}
                        </span>
                    </div>

                    {/* Ubicación o enlace (si es online) */}
                    {(event.location || event.modality === "online") && (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {event.modality === "online" ? (
                                    <Link size={24} className="text-gray-400"/>
                                ) : (
                                    <MapPin size={24} className="text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    {event.modality === "online" ? "Enlace" : "Ubicación"}
                                </p>
                                <p className="text-sm text-white">
                                    {event.modality === "online" ? (
                                        event.link ? (
                                            <a>
                                                {event.link}
                                            </a>
                                        ) : (
                                            "En línea"
                                        )
                                    ) : (
                                        event.location
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Ponente */}
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User size={24} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Ponente</p>
                            <p className="text-sm text-white">{presenterName}</p>
                        </div>
                    </div>
                </div>

                {/* Imagen placeholder */}
                <div className="flex-shrink-0 w-64 h-40 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <img
                        //Imagen en lo que sesar o big se les ocurre añadirlo lol
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VzbIhiRMB3MDNu1_rl05tug8QtXXRpKuUA&s"
                        alt="Event preview"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Botón */}
            <button className="relative z-10 w-full mt-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:rounded-3xl duration-300 cursor-pointer" onClick={() => {
                window.location.href = redirectUrl
            }}>
                {buttonText}
            </button>
        </div>
    )
}
