import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export type UserRole = "asistente" | "ponente" | "organizador";

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  [key: string]: any;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string): Promise<UserSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as UserSession;
  } catch (error) {
    return null;
  }
}

export const getSession = async (): Promise<UserSession | null> => {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('auth-token')?.value;  if (!token) return null;
  
  const user = await verifyToken(token);
  return user;
};