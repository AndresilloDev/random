"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // --- INICIO DE DEBUG ---
    console.log("Página de callback de Google cargada.");
    
    // 1. Obtener el token de la URL
    const token = searchParams.get("token");
    
    if (token) {
      console.log("Token encontrado:", token);
      
      // 2. Guardar el token en localStorage
      localStorage.setItem("authToken", token);
      console.log("Token guardado en localStorage.");
      
      // 3. Redirigir al dashboard
      console.log("Redirigiendo a /dashboard...");
      router.push("/dashboard"); // <-- Asegúrate que esta ruta exista

    } else {
      // 4. Si no hay token, redirigir al login
      console.error("ERROR: No se encontró ningún 'token' en la URL.");
      console.log("Parámetros de URL actuales:", searchParams.toString());
      
      // Comprobar si hay un parámetro de error
      const error = searchParams.get("error");
      if(error) {
        console.error("Se recibió un error:", error);
      }

      console.log("Redirigiendo a /login...");
      router.push("/login");
    }
    // --- FIN DE DEBUG ---
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Procesando inicio de sesión...</p>
    </div>
  );
}

// Usamos <Suspense> porque useSearchParams() lo requiere
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <GoogleCallbackLogic />
    </Suspense>
  );
}