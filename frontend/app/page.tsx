// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Bienvenido a tu App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema de autenticación con Google OAuth y credenciales tradicionales
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600"
          >
            Registrarse
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Seguro</h3>
            <p className="text-sm text-gray-600">
              Autenticación JWT con cookies httpOnly
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rápido</h3>
            <p className="text-sm text-gray-600">
              Inicio de sesión con Google en un clic
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confiable</h3>
            <p className="text-sm text-gray-600">
              Integrado con MongoDB y backend robusto
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}