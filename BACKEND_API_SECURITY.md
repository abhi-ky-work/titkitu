# Backend API Security with AWS Cognito - Complete Guide

## Overview

This guide explains how to secure your backend APIs using AWS Cognito JWT tokens with Architecture 1 (Direct Client-Side).

## Architecture Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. User signs in via Cognito
       │    (gets ID Token, Access Token, Refresh Token)
       │
       ▼
┌─────────────────┐
│  AWS Cognito    │
│  (Authentication)│
└─────────────────┘
       │
       │ 2. Tokens stored in browser memory
       │
       ▼
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 3. API Request with ID Token
       │    Authorization: Bearer <idToken>
       │
       ▼
┌─────────────────┐
│  Next.js API    │
│  Route Handler  │
└──────┬──────────┘
       │
       │ 4. Verify JWT Token
       │    - Check signature (JWKS)
       │    - Check expiration
       │    - Check issuer & audience
       │
       ▼
┌─────────────────┐
│  AWS Cognito    │
│  JWKS Endpoint  │
│  (Public Keys)  │
└─────────────────┘
       │
       │ 5. Token verified ✓
       │
       ▼
┌─────────────────┐
│  API Response   │
│  (Protected Data)│
└─────────────────┘
```

## Setup Instructions

### 1. Install Required Package

```bash
npm install jose
```

### 2. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_REGION=us-east-1  # Your Cognito region
```

### 3. Token Types Explained

**ID Token** (Use for backend APIs):
- Contains user identity (email, username, groups)
- Short-lived (typically 1 hour)
- Use for: User identification, authorization checks
- Format: JWT with user claims

**Access Token**:
- Used for AWS service calls (API Gateway, etc.)
- Contains scopes and permissions
- Use for: AWS resource access

**Refresh Token**:
- Long-lived token to get new ID/Access tokens
- Stored securely by Amplify
- Automatically used when tokens expire

## Frontend: Making Authenticated API Calls

### Method 1: Using authenticatedFetch (Recommended)

```typescript
'use client'

import { authenticatedFetch } from '@/lib/apiClient';

async function fetchUserData() {
  try {
    const response = await authenticatedFetch('/api/protected');
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    console.log('User data:', data);
  } catch (error) {
    console.error('Error:', error);
    // Handle error (redirect to login, etc.)
  }
}
```

### Method 2: Using axios

```typescript
'use client'

import axios from 'axios';
import { getAuthHeaders } from '@/lib/apiClient';

async function fetchWithAxios() {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get('/api/protected', { headers });
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Method 3: Manual token attachment

```typescript
'use client'

import { getSessionTokens } from '@/lib/cognitoActions';

async function manualFetch() {
  const tokens = await getSessionTokens();
  
  if (!tokens?.idToken) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${tokens.idToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}
```

## Backend: Verifying Tokens

### Option 1: Manual Verification (Full Control)

```typescript
// src/app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromHeader } from '@/lib/verifyToken';

export async function GET(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const payload = await verifyTokenFromHeader(authHeader, 'id');
    
    // Token is valid! Use payload data
    const userId = payload.sub;
    const email = payload.email;
    const username = payload['cognito:username'];
    const groups = payload['cognito:groups'] || [];
    
    // Your protected logic here
    return NextResponse.json({
      success: true,
      user: {
        userId,
        email,
        username,
        groups,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
```

### Option 2: Using withAuth Wrapper (Simpler)

```typescript
// src/app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/authMiddleware';

export const GET = withAuth(async (request: NextRequest, payload) => {
  // payload is already verified - no need to check
  return NextResponse.json({
    success: true,
    userId: payload.sub,
    email: payload.email,
  });
});
```

## Token Verification Process

The `verifyTokenFromHeader` function performs:

1. **Extract Token**: Gets token from `Authorization: Bearer <token>` header
2. **Verify Signature**: Uses Cognito's JWKS (JSON Web Key Set) to verify token signature
3. **Check Expiration**: Ensures token hasn't expired
4. **Verify Issuer**: Checks token was issued by your Cognito User Pool
5. **Verify Audience**: Checks token is for your app client
6. **Check Token Use**: Ensures it's an ID token (not access token)

## Security Best Practices

### ✅ DO:
- Always verify tokens on the backend
- Use ID tokens for user identification
- Check user groups/roles for authorization
- Handle token expiration gracefully
- Use HTTPS in production

### ❌ DON'T:
- Trust client-side token validation alone
- Store tokens in localStorage (Amplify handles this)
- Expose client secrets in frontend code
- Skip token verification on backend

## Error Handling

```typescript
try {
  const payload = await verifyTokenFromHeader(authHeader);
  // Token is valid
} catch (error: any) {
  if (error.message.includes('expired')) {
    // Token expired - client should refresh
    return NextResponse.json(
      { error: 'Token expired', code: 'TOKEN_EXPIRED' },
      { status: 401 }
    );
  }
  if (error.message.includes('missing')) {
    // No token provided
    return NextResponse.json(
      { error: 'Authentication required', code: 'NO_TOKEN' },
      { status: 401 }
    );
  }
  // Other verification errors
  return NextResponse.json(
    { error: 'Invalid token', code: 'INVALID_TOKEN' },
    { status: 401 }
  );
}
```

## Example: Protected API Route

See `/src/app/api/protected/route.ts` for a complete example.

## Testing

1. Sign in through your frontend
2. Make an API call using `authenticatedFetch('/api/protected')`
3. Check the response - should include user data if authenticated
4. Try without token - should return 401

## Troubleshooting

**Error: "Token verification failed"**
- Check `NEXT_PUBLIC_USER_POOL_ID` is correct
- Check `NEXT_PUBLIC_AWS_REGION` matches your Cognito region
- Verify token hasn't expired

**Error: "Authorization header is missing"**
- Ensure frontend is sending `Authorization: Bearer <token>` header
- Check user is signed in

**Error: "Invalid token"**
- Token might be malformed
- Check token is ID token (not access token)
- Verify client ID matches

