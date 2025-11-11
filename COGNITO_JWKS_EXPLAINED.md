# How Cognito Public Keys (JWKS) Work - Complete Explanation

## Quick Answer

**You don't need to manually fetch Cognito's public keys!** The `jose` library does this automatically using `createRemoteJWKSet()`.

## How It Works

### 1. Cognito Provides Public Keys Automatically

AWS Cognito exposes public keys via a **public JWKS endpoint**:

```
https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

**Example:**
```
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json
```

### 2. Our Code Automatically Fetches Keys

In `src/lib/verifyToken.ts` (lines 7-11):

```typescript
// Cognito JWKS URL format
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

// Create remote JWKS set - automatically fetches and caches keys
const JWKS = createRemoteJWKSet(new URL(jwksUrl));
```

### 3. Token Verification Process

When you call `verifyCognitoToken()`:

```
1. JWT Token arrives
   ↓
2. Extract 'kid' (Key ID) from JWT header
   ↓
3. JWKS automatically fetches public key matching 'kid'
   ↓
4. Verify token signature using public key
   ↓
5. Verify token claims (expiration, issuer, audience)
   ↓
6. Return verified payload ✓
```

## Visual Flow

```
┌─────────────────────────────────────────────────────────┐
│  Your Backend API Route                                  │
│  (verifyTokenFromHeader)                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ 1. Receives JWT Token
                   │    Header: { kid: "abc123", alg: "RS256" }
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  jose library (createRemoteJWKSet)                     │
│  - Checks cache for key with kid="abc123"              │
│  - If not found, fetches from Cognito JWKS endpoint    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ 2. Fetches JWKS (if needed)
                   │    GET https://cognito-idp.../.well-known/jwks.json
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  AWS Cognito JWKS Endpoint                              │
│  Returns:                                               │
│  {                                                      │
│    "keys": [                                            │
│      {                                                  │
│        "kid": "abc123",                                 │
│        "alg": "RS256",                                   │
│        "kty": "RSA",                                     │
│        "n": "public-key-modulus...",                    │
│        "e": "AQAB"                                      │
│      },                                                 │
│      {                                                  │
│        "kid": "def456",                                 │
│        ...                                              │
│      }                                                  │
│    ]                                                    │
│  }                                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ 3. Returns public key
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  jose library (jwtVerify)                               │
│  - Uses public key to verify JWT signature              │
│  - Verifies expiration, issuer, audience               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ 4. Returns verified payload
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Your API Route                                         │
│  Receives: { sub, email, username, ... }                │
└─────────────────────────────────────────────────────────┘
```

## Key Points

### ✅ Automatic & Cached
- `createRemoteJWKSet()` **automatically fetches** keys when needed
- Keys are **cached in memory** for performance
- No manual fetching required!

### ✅ Key Rotation Handled
- Cognito rotates keys periodically
- `jose` library automatically fetches new keys when `kid` doesn't match
- No code changes needed

### ✅ Secure
- Public keys only (safe to expose)
- HTTPS endpoint (encrypted)
- No secrets in JWKS

## Manual Inspection (Optional)

If you want to see the JWKS yourself:

### Option 1: Browser
Visit in your browser:
```
https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

### Option 2: curl
```bash
curl https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json
```

### Option 3: Use the utility
```typescript
import { fetchCognitoJWKS } from '@/lib/inspectJWKS';

const jwks = await fetchCognitoJWKS(userPoolId, region);
console.log(jwks);
```

## Example JWKS Response

```json
{
  "keys": [
    {
      "kid": "abc123def456...",
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbF...",
      "e": "AQAB"
    },
    {
      "kid": "xyz789ghi012...",
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "n": "1wX8bgoebGcQSuuPiLJXZptN9nndrQmbF...",
      "e": "AQAB"
    }
  ]
}
```

## How JWT Header Maps to JWKS

When Cognito issues a JWT, the header contains:

```json
{
  "kid": "abc123def456...",  // Key ID - identifies which public key to use
  "alg": "RS256"             // Algorithm - RSA with SHA-256
}
```

The `kid` (Key ID) matches one of the keys in the JWKS, allowing the verifier to:
1. Find the correct public key
2. Verify the token signature
3. Ensure the token was signed by Cognito

## Summary

**You don't need to do anything!** The code in `src/lib/verifyToken.ts` already:
- ✅ Automatically fetches public keys from Cognito
- ✅ Caches them for performance
- ✅ Handles key rotation
- ✅ Verifies tokens using the correct key

Just use `verifyTokenFromHeader()` in your API routes - it handles everything!

