"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        role: "attendee",
      });
      router.push("/login");
    } catch (err) {
      let msg = "Error al registrarse.";

      if (err instanceof AxiosError) {
        msg = err.response?.data?.message || "Error del servidor";
      } else if ((err as any).request) {
        msg = "No hay conexión";
      } else if ((err as any).message) {
        msg = (err as any).message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #1B293A 0%, #131517 75%)" }}
    >
      <div className="w-full max-w-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-3xl text-white">Crear Cuenta</h1>
        <p className="text-gray-400 text-base mb-6">Regístrate para acceder a tu espacio</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="text-white text-base mb-2 block">
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white"
              placeholder="Pedro"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="text-white text-base mb-2 block">
              Apellidos
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white"
              placeholder="Juárez"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-white text-base mb-2 block">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-white text-base mb-2 block">
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white pr-12"
              placeholder="C0n7r4s3ñ4"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-300 hover:text-white p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            aria-busy={loading}
            className="w-full py-3 bg-black/80 text-white rounded-2xl border border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-black/40 hover:rounded-3xl duration-300"
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  aria-hidden="true"
                />
                <span>Registrando…</span>
              </>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-2xl mb-6 text-red-200 text-sm">
            {error}
          </div>
        )}

        <p className="text-right text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando…</div>}>
      <RegisterForm />
    </Suspense>
  );
}