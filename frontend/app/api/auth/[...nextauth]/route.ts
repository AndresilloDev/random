// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api'; // Importamos nuestra instancia de Axios

export const authOptions: AuthOptions = {
  // 1. Configuración de Proveedores
  providers: [
    // --- Proveedor de Google (OAuth) ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // --- Proveedor de Credenciales (Tu Backend) ---
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      /**
       * Esta función se llama al ejecutar signIn() con 'credentials'.
       * Valida las credenciales contra tu propio backend.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña requeridos');
        }

        // Log de depuración: Qué estamos enviando
        console.log(
          '[NextAuth Authorize] Intentando autenticar con email:',
          credentials.email
        );

        try {
          // Usamos la instancia de Axios para llamar a tu backend
          const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          // Log de depuración: Qué nos respondió el backend
          console.log(
            '[NextAuth Authorize] Respuesta del Backend:',
            response.data
          );

          const responseData = response.data;

          // Validamos que la respuesta del backend sea exitosa
          // y tenga la estructura que esperamos (value.user y value.token)
          if (
            responseData.success &&
            responseData.value &&
            responseData.value.user &&
            responseData.value.token
          ) {
            const backendUser = responseData.value.user;
            const backendToken = responseData.value.token;

            console.log(
              '[NextAuth Authorize] Autenticación exitosa. Mapeando usuario.'
            );

            // Devolvemos el objeto 'user' que NextAuth usará
            // Esto se pasa al callback 'jwt'
            return {
              id: backendUser._id, // Mapeamos _id a id
              email: backendUser.email,
              name: `${backendUser.first_name} ${backendUser.last_name}`,
              role: backendUser.role, // Pasamos el rol
              accessToken: backendToken,
            };
          } else {
            // Si success: false o la estructura es incorrecta
            console.warn(
              '[NextAuth Authorize] La respuesta del backend no fue exitosa o tiene formato inesperado:',
              responseData.message
            );
            throw new Error(
              responseData.message || 'Respuesta inválida del servidor'
            );
          }
        } catch (error: any) {
          // Capturamos errores de Axios (ej. 401 del backend, 500, etc.)
          const errorMessage =
            error.response?.data?.message || 'Credenciales inválidas';
          console.error(
            '[NextAuth Authorize] Error al llamar al backend:',
            errorMessage
          );
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  // 2. Estrategia de Sesión
  // Usamos JWT para las sesiones
  session: {
    strategy: 'jwt',
  },

  // 3. Callbacks
  // Controlan lo que se incluye en el JWT y en el objeto Session
  callbacks: {
    /**
     * Se llama después de 'authorize' en el inicio de sesión.
     * Guarda los datos personalizados (id, role, accessToken) en el token.
     */
    async jwt({ token, user }) {
      // 'user' solo está presente en el inicio de sesión inicial
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    /**
     * Se llama cada vez que se accede a la sesión (ej. useSession()).
     * Pasa los datos del 'token' (JWT) a la 'session' (Cliente).
     */
    async session({ session, token }) {
      // Pasamos los datos del token a la sesión del cliente
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      session.accessToken = token.accessToken;

      return session;
    },
  },

  // 4. Páginas Personalizadas
  // Le decimos a NextAuth dónde está nuestra página de login
  pages: {
    signIn: '/login',
    // error: '/auth/error', // (Opcional) Puedes crear una página para errores
  },

  // 5. Secret
  // Variable de entorno para firmar los JWT
  secret: process.env.NEXTAUTH_SECRET,
};

// 6. Exportación del Handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };