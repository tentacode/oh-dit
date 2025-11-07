import { getAuthToken } from '@/src/features/authentication/utils/getAuthToken';
import { redirect } from 'next/navigation';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_HOST}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    redirect('/session-expired');
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Erreur API: ${response.statusText}`
    );
  }

  return response.json();
}