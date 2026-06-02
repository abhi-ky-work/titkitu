'use client'

import { getSessionTokens } from './cognitoActions';

/**
 * Backend API base URL
 * Set this in your .env.local file as NEXT_PUBLIC_BACKEND_API_URL
 */
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

/**
 * Gets the access token for backend API authentication
 * Uses Access Token (not ID Token) for backend API calls
 */
async function getAccessToken(): Promise<string> {
  const tokens = await getSessionTokens();
  
  if (!tokens?.accessToken) {
    throw new Error('No authentication token available. Please sign in.');
  }

  return tokens.accessToken;
}

/**
 * Creates authenticated headers with access token
 */
async function getAuthHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
  const accessToken = await getAccessToken();
  
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...customHeaders,
  };
}

/**
 * Builds the full URL for backend API calls
 */
function buildApiUrl(endpoint: string): string {
  // If endpoint is already a full URL, use it as is
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Combine with base URL
  return `${BACKEND_API_URL}/${cleanEndpoint}`;
}

/**
 * Makes an authenticated API request to your backend server
 * Automatically attaches the Authorization header with the Access Token
 * 
 * @param endpoint - API endpoint (e.g., 'users/profile' or full URL)
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Response object
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken();
  const url = buildApiUrl(endpoint);
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  
  // Set Content-Type if not already set and body is provided
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  console.log("url options ", url, options);
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper function for GET requests
 */
export async function apiGet<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const response = await authenticatedFetch( process.env.NEXT_PUBLIC_BACKEND_API_URL + endpoint, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper function for POST requests
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<T | null> {
  const response = await authenticatedFetch(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Helper function for PUT requests
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<T | null> {
  const response = await authenticatedFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Helper function for PATCH requests
 */
export async function apiPatch<T = any>(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<T | null> {
  const response = await authenticatedFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Helper function for DELETE requests
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const response = await authenticatedFetch(endpoint, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  // DELETE requests might return empty body
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Get authentication headers (useful for axios or other HTTP clients)
 */
export { getAuthHeaders };
