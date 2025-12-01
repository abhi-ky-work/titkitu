# Frontend API Client - Quick Reference

## Overview

This Next.js app is configured as a **frontend-only application** that calls your backend server APIs using Cognito Access Tokens for authentication.

## Setup

### 1. Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-server.com/api
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### 2. Import and Use

```typescript
'use client'

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/apiClient';

// Example: Fetch user data
const user = await apiGet('/users/profile');

// Example: Create event
const event = await apiPost('/events', {
  title: 'My Event',
  description: 'Event description',
  date: '2024-01-01'
});

// Example: Update event
const updated = await apiPut('/events/123', { title: 'Updated Title' });

// Example: Delete event
await apiDelete('/events/123');
```

## Available Functions

| Function | Method | Description |
|----------|--------|-------------|
| `apiGet<T>(endpoint)` | GET | Fetch data from backend |
| `apiPost<T>(endpoint, data)` | POST | Create new resource |
| `apiPut<T>(endpoint, data)` | PUT | Update resource |
| `apiPatch<T>(endpoint, data)` | PATCH | Partial update |
| `apiDelete<T>(endpoint)` | DELETE | Delete resource |
| `authenticatedFetch(endpoint, options)` | Any | Low-level fetch with auth |

## How It Works

1. **User signs in** → Cognito provides Access Token
2. **Frontend calls API** → `apiGet`, `apiPost`, etc.
3. **Token attached** → `Authorization: Bearer <accessToken>` header
4. **Backend verifies** → Your backend validates the token
5. **Response returned** → JSON data or error

## Error Handling

```typescript
try {
  const data = await apiGet('/users/profile');
} catch (error) {
  if (error.message.includes('No authentication token')) {
    // User not signed in - redirect to login
    router.push('/partnerLogin');
  } else if (error.message.includes('401')) {
    // Unauthorized - token expired
    // Amplify will auto-refresh, but you may want to retry
  } else {
    // Other errors (network, server, etc.)
    console.error('API Error:', error);
  }
}
```

## Backend Requirements

Your backend server must:
1. Accept `Authorization: Bearer <accessToken>` header
2. Verify the Access Token using Cognito's JWKS endpoint
3. Extract user info from token payload (sub, email, etc.)

See `BACKEND_API_SETUP.md` for backend implementation examples.

## Files

- **`src/lib/apiClient.ts`** - Main API client with all helper functions
- **`src/lib/backendApiExamples.ts`** - Example usage patterns (can be deleted)
- **`BACKEND_API_SETUP.md`** - Complete setup guide with backend examples
- **`src/lib/verifyToken.ts`** - Token verification code (for your backend server)

## Notes

- ✅ Uses **Access Token** (not ID Token) for backend API calls
- ✅ Automatically handles token refresh via Amplify
- ✅ Supports relative endpoints (`/users/profile`) or full URLs
- ✅ All requests include `Content-Type: application/json`
- ✅ Automatic error handling and JSON parsing

