# Backend API Setup Guide

This guide explains how to use the frontend API client to call your backend server with Cognito access tokens.

## Frontend Setup

### 1. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-server.com/api
# or for local development:
# NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001/api
```

### 2. Using the API Client

The API client automatically:
- ✅ Fetches the Access Token from Cognito
- ✅ Attaches it to the `Authorization: Bearer <accessToken>` header
- ✅ Handles errors and response parsing
- ✅ Supports GET, POST, PUT, PATCH, DELETE methods

### 3. Example Usage

```typescript
'use client'

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/apiClient';

// GET request
async function fetchUserProfile() {
  try {
    const profile = await apiGet('/users/profile');
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Error:', error);
  }
}

// POST request
async function createEvent(eventData: {
  title: string;
  description: string;
  date: string;
}) {
  try {
    const event = await apiPost('/events', eventData);
    return event;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// PUT request
async function updateEvent(eventId: string, data: any) {
  try {
    const event = await apiPut(`/events/${eventId}`, data);
    return event;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// DELETE request
async function deleteEvent(eventId: string) {
  try {
    await apiDelete(`/events/${eventId}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Backend Server Setup

Your backend server needs to verify the Cognito Access Token. Here's how:

### 1. Token Format

The frontend sends:
```
Authorization: Bearer <accessToken>
```

### 2. Backend Verification

Your backend should verify the Access Token using Cognito's JWKS endpoint.

**Node.js/Express Example:**

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, getKey, {
    audience: process.env.COGNITO_CLIENT_ID,
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded; // Contains user info (sub, email, etc.)
    next();
  });
}

// Use in routes
app.get('/api/users/profile', verifyToken, (req, res) => {
  res.json({ userId: req.user.sub, email: req.user.email });
});
```

**Python/FastAPI Example:**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

security = HTTPBearer()
jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"
jwks_client = PyJWKClient(jwks_url)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
            issuer=f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}"
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@app.get("/api/users/profile")
async def get_profile(user: dict = Depends(verify_token)):
    return {"userId": user["sub"], "email": user.get("email")}
```

### 3. Token Payload Structure

The Access Token payload contains:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "email_verified": true,
  "token_use": "access",
  "scope": "aws.cognito.signin.user.admin",
  "auth_time": 1234567890,
  "iss": "https://cognito-idp.region.amazonaws.com/userPoolId",
  "exp": 1234567890,
  "iat": 1234567890,
  "jti": "token-id",
  "client_id": "your-client-id",
  "username": "user@example.com"
}
```

## Available Functions

### `authenticatedFetch(endpoint, options)`
Low-level function for custom requests.

### `apiGet<T>(endpoint, options?)`
GET request with automatic JSON parsing.

### `apiPost<T>(endpoint, data?, options?)`
POST request with automatic JSON body and parsing.

### `apiPut<T>(endpoint, data?, options?)`
PUT request with automatic JSON body and parsing.

### `apiPatch<T>(endpoint, data?, options?)`
PATCH request with automatic JSON body and parsing.

### `apiDelete<T>(endpoint, options?)`
DELETE request with automatic JSON parsing.

### `getAuthHeaders()`
Get headers object for use with axios or other HTTP clients.

## Error Handling

All functions throw errors on:
- Missing authentication token
- Network errors
- HTTP errors (4xx, 5xx)
- Invalid JSON responses

```typescript
try {
  const data = await apiGet('/users/profile');
} catch (error) {
  if (error.message.includes('No authentication token')) {
    // Redirect to login
  } else if (error.message.includes('401')) {
    // Unauthorized - token expired or invalid
  } else {
    // Other errors
  }
}
```

## Notes

- **Access Token** is used (not ID Token) for backend API calls
- Tokens are automatically refreshed by Amplify when expired
- Base URL is configured via `NEXT_PUBLIC_BACKEND_API_URL`
- All requests include `Content-Type: application/json` header
- Full URLs can be used instead of relative endpoints

