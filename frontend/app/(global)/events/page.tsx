"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"  // Asegúrate de que esta ruta sea correcta
import api from "../../../lib/api" // Asegúrate que esta ruta sea correcta

// Importar los nuevos componentes
import AnimatedSwitch from "../../components/(ui)/AnimatedSwitch" // Ajusta la ruta
import EventFilterBar from "../../components/(global)/events/EventFilterBar" // Ajusta la ruta
import EventCard from "../../components/(global)/events/EventCard" // Ajusta la ruta
import LoadingSpinner from "../../components/(ui)/LoadingSpinner" // Ajusta la ruta
import ErrorDisplay from "../../components/(ui)/ErrorDisplay" // Ajusta la ruta

// Tipos (se mantienen en la página ya que son necesarios para la carga de datos)
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

interface Presenter {
  _id: string
  first_name: string
  last_name: string
  email: string
}

export default function EventsPage() {
  const { user, loading } = useAuth() // Aquí obtenemos el estado del usuario desde el hook useAuth
  const [events, setEvents] = useState<Event[]>([])
  const [presenters, setPresenters] = useState<Presenter[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")

  // Filtros
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("upcoming")
  const [presenterFilter, setPresenterFilter] = useState<string>("all")

  // Cargar eventos y presentadores
  useEffect(() => {
    loadData()
  }, [typeFilter, dateFilter, presenterFilter])

  const loadData = async () => {
    setLoadingData(true)
    setError("")

    try {
      // Construir query params
      const params: any = {}
      if (typeFilter !== "all") params.type = typeFilter
      if (presenterFilter !== "all") params.presenter = presenterFilter

      // Filtro de fecha
      const now = new Date()
      if (dateFilter === "upcoming") {
        params["date[gte]"] = now.toISOString()
      } else if (dateFilter === "past") {
        params["date[lt]"] = now.toISOString()
      }
      params.sort = "date"

      // Cargar eventos
      const { data: eventsData } = await api.get("/events", { params })
      setEvents(eventsData.value.results)

      // Cargar presentadores si aún no se han cargado
      if (presenters.length === 0) {
        const { data: presentersData } = await api.get("/users", {
          params: { role: "presenter" },
        })
        setPresenters(presentersData.value.results)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar eventos")
      console.error("Error:", err)
    } finally {
      setLoadingData(false)
    }
  }

  // Agrupar eventos por fecha
  const groupEventsByDate = (events: Event[]) => {
    const grouped: Record<string, Event[]> = {}
    events.forEach((event) => {
      const date = new Date(event.date)
      const dateKey = date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(event)
    })
    return grouped
  }

  const groupedEvents = groupEventsByDate(events)

  // Obtener nombre del presentador
  const getPresenterName = (presenterId: string) => {
    const presenter = presenters.find((p) => p._id === presenterId)
    return presenter ? `${presenter.first_name} ${presenter.last_name}` : "Presentador desconocido"
  }

  // Determinar el título basado en el rol del usuario
  const pageTitle = user?.role === "presenter" ? "Ponencias" : "Eventos"

  return (
    <div className="min-h-screen text-white p-8" style={{ background: "linear-gradient(180deg, #1B293A 0%, #040711 10%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          {/* Título condicionado por el rol */}
          <h1 className="text-5xl font-bold">{pageTitle}</h1>
          <AnimatedSwitch
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: "upcoming", label: "Próximos" },
              { value: "past", label: "Finalizados" },
            ]}
          />
        </div>

        <EventFilterBar
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          presenterFilter={presenterFilter}
          onPresenterChange={setPresenterFilter}
          presenters={presenters}
        />

        {/* Error */}
        {error && <ErrorDisplay message={error} />}

        {/* Loading */}
        {loadingData && <LoadingSpinner />}

        {/* Eventos agrupados por fecha */}
        {!loadingData && Object.keys(groupedEvents).length === 0 && (
          <div className="text-center py-12 text-gray-400">No se encontraron eventos</div>
        )}

        {!loadingData && (
          <div className="space-y-0">
            {Object.entries(groupedEvents).map(([date, dateEvents], groupIndex) => (
              <div key={date} className="relative flex">
                {/* Columna Izquierda - Fecha */}
                <div className="flex-shrink-0 w-48 pr-8 pt-2">
                  <div className="text-left">
                    <p className="text-xl font-semibold">
                      {new Date(dateEvents[0].date)
                        .toLocaleDateString("es-MX", {
                          month: "long",
                          day: "numeric",
                        })
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {new Date(dateEvents[0].date).toLocaleDateString("es-MX", {
                        weekday: "long",
                      })}
                    </p>
                  </div>
                </div>

                {/* Línea vertical con punto */}
                <div className="relative flex-shrink-0 w-8 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-600 mt-3 z-10"></div>
                  {groupIndex < Object.keys(groupedEvents).length - 1 && (
                    <div className="absolute top-3 bottom-0 left-1/2 -translate-x-1/2 w-px border-l-2 border-dashed border-gray-800"></div>
                  )}
                </div>

                {/* Columna Derecha - Eventos */}
                <div className="flex-grow pl-8 pb-8 space-y-6">
                  {dateEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      presenterName={getPresenterName(event.presenter)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
