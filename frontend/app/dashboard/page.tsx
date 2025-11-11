// frontend/app/dashboard/page.tsx
'use client';

import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El middleware redirigirá
  }
  console.log('Usuario autenticado en Dashboard:', user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-black">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bienvenido al Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 - Perfil */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Tu Perfil</h3>
              <p className="text-sm text-gray-600">Usuario ID: {user.id}</p>
              <p className="text-sm font-medium text-black capitalize">Rol: {user.role}</p>
              <p className="text-sm font-medium text-black">{user.email}</p>
            </div>

            {/* Card 2 - Estado */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="text-green-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Estado</h3>
              <p className="text-sm text-gray-600">Sesión activa</p>
              <p className="text-xs text-gray-500 mt-1">Token válido</p>
            </div>

            {/* Card 3 - Actividad */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="text-purple-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Actividad</h3>
              <p className="text-sm text-gray-600">Última conexión: Ahora</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Autenticación exitosa</p>
                <p className="text-sm text-green-700 mt-1">
                  Tu sesión está protegida con JWT y middleware personalizado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ Sin NextAuth - Sistema personalizado</p>
            <p>✅ Middleware personalizado para protección de rutas</p>
            <p>✅ JWT almacenado en cookies httpOnly</p>
            <p>✅ Integración con backend Express</p>
            <p>✅ Soporte para Google OAuth</p>
          </div>
        </div>
      </main>
    </div>
  );
}