# How Cognito Public Keys (JWKS) Work

## Overview

AWS Cognito automatically provides public keys via a **JWKS (JSON Web Key Set) endpoint**. These public keys are used to verify JWT token signatures.

## JWKS Endpoint URL Format

```
https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

**Example:**
```
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json
```

## How It Works in Our Code

In `src/lib/verifyToken.ts`, we use the `jose` library's `createRemoteJWKSet()` function:

```typescript
import { createRemoteJWKSet } from 'jose';

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));
```

### What `createRemoteJWKSet` Does:

1. **Automatically fetches** the JWKS from Cognito's endpoint
2. **Caches the keys** in memory for performance
3. **Automatically refreshes** keys when they rotate (Cognito rotates keys periodically)
4. **Selects the correct key** based on the `kid` (Key ID) in the JWT header

## Manual Inspection

You can manually fetch and inspect the JWKS:

```bash
# Replace with your region and user pool ID
curl https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json
```

**Response format:**
```json
{
  "keys": [
    {
      "kid": "abc123...",
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "n": "base64-encoded-modulus...",
      "e": "AQAB"
    },
    {
      "kid": "def456...",
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "n": "base64-encoded-modulus...",
      "e": "AQAB"
    }
  ]
}
```

## How Token Verification Works

1. **JWT Header** contains `kid` (Key ID) - identifies which public key to use
2. **JWKS lookup** - Fetches the public key matching the `kid` from Cognito
3. **Signature verification** - Uses the public key to verify the token signature
4. **Claims verification** - Checks expiration, issuer, audience, etc.

## Key Rotation

Cognito automatically rotates keys periodically. The `jose` library handles this:
- Caches keys for performance
- Automatically fetches new keys when `kid` doesn't match cached keys
- No manual intervention needed

## Security

- **Public keys only** - These are public keys, safe to expose
- **No secrets** - Only public keys are in the JWKS
- **HTTPS only** - Cognito serves JWKS over HTTPS
- **Automatic rotation** - Keys rotate automatically for security

