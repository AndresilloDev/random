import AuthProvider from './components/AuthProvider'; // Ajusta la ruta
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Header */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}