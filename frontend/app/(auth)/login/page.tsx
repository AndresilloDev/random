"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../lib/api";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  no_token: "No se recibió el token",
  callback_failed: "Error al autenticar con Google",
  session_expired: "Los datos son inválidos",
  authentication_failed: "Falló la autenticación",
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading, checkAuth } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.push("/dashboard");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(ERROR_MESSAGES[urlError] || "Error de autenticación");
    }
  }, [searchParams]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (!data.success || !data.value?.token) {
        throw new Error("No se recibió el token de autenticación");
      }

      document.cookie = `auth-token=${data.value.token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      
      await checkAuth();
      
      setTimeout(() => router.push("/dashboard"), 100);
    } catch (err) {
      const message = err instanceof AxiosError 
        ? err.response?.data?.message || "Error del servidor"
        : err instanceof Error 
        ? err.message 
        : "Error al iniciar sesión";
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #1B293A 0%, #131517 75%)" }}
    >
      <div className="w-full max-w-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-3xl text-white">Iniciar Sesión</h1>
        <p className="text-gray-400 text-base mb-6">Accede a tu espacio personal</p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-2xl mb-6 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
              className="absolute right-3 top-11 text-gray-300 hover:text-white p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="text-right text-sm text-gray-400 mb-4">
            ¿Olvidaste tu contraseña?{" "}
            <a href="/reset-password" className="underline">
              Recupérala
            </a>
          </p>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full py-3 bg-black/80 text-white rounded-2xl border border-white/10 flex items-center justify-center gap-3 cursor-pointer hover:bg-black/40 hover:rounded-3xl duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  aria-hidden="true"
                />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-gray-400 text-sm">o</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 bg-white text-gray-800 rounded-2xl flex items-center justify-center gap-3 mb-4 hover:bg-gray-200 hover:rounded-3xl duration-300 cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continuar con Google
        </button>

        <p className="text-right text-sm text-gray-400 mb-4">
          ¿No tienes cuenta?{" "}
          <a href="/signup" className="underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando…</div>}>
      <LoginForm />
    </Suspense>
  );
}