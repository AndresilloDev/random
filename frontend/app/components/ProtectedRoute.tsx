"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Este componente envolverá tus páginas protegidas
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Esperamos a que el componente se "hidrate" en el cliente
  if (!isClient) {
    // Muestra un loader o nada mientras se verifica
    return <div>Cargando...</div>; 
  }

  // Ahora sí leemos el localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Si no hay token, redirigir al login
    router.push("/login");
    return <div>Redirigiendo a login...</div>;
  }

  // Si hay token, muestra el contenido de la página
  return <>{children}</>;
}