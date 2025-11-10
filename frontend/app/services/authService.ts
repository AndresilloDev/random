import api from '../../lib/axios';

export async function loginWithCredentials(email: string, password: string) {
  const { data } = await api.post('/auth/credentials/login', { email, password });
  return data;
}

export function loginWithGoogle() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  window.location.href = `${backendUrl}/auth/google`;
}