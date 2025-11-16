/**
 * NOTE: This file is for BACKEND SERVER use only!
 * 
 * This code can be used in your backend server to verify Cognito Access Tokens
 * sent from the frontend. The frontend uses apiClient.ts to call your backend APIs.
 * 
 * Copy this code to your backend server and use it to verify tokens in your API routes.
 */

import { jwtVerify, createRemoteJWKSet } from 'jose';

// Get Cognito User Pool ID from environment
const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID;
const region = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'; // Default region

// Cognito JWKS URL format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

// Create remote JWKS set for token verification
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export interface VerifiedTokenPayload {
  sub: string; // User ID
  email?: string;
  email_verified?: boolean;
  'cognito:username'?: string;
  'cognito:groups'?: string[];
  exp: number;
  iat: number;
  iss: string;
  token_use: 'id' | 'access';
  aud: string;
}

/**
 * Verifies a Cognito JWT token (ID token or Access token)
 * @param token - The JWT token string
 * @param tokenUse - Expected token use ('id' or 'access')
 * @returns Decoded and verified token payload
 * @throws Error if token is invalid, expired, or verification fails
 */
export async function verifyCognitoToken(
  token: string,
  tokenUse: 'id' | 'access' = 'id'
): Promise<VerifiedTokenPayload> {
  try {
    // Verify the token signature and claims
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      audience: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    });

    // Verify token_use matches expected type
    if (payload.token_use !== tokenUse) {
      throw new Error(`Invalid token_use. Expected ${tokenUse}, got ${payload.token_use}`);
    }

    // Verify token is not expired (jwtVerify already checks this, but we can add custom checks)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token has expired');
    }

    return payload as unknown as VerifiedTokenPayload;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Token has expired');
    }
    if (error.code === 'ERR_JWT_INVALID') {
      throw new Error('Invalid token');
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

/**
 * Extracts and verifies token from Authorization header
 * @param authHeader - Authorization header value (e.g., "Bearer <token>")
 * @param tokenUse - Expected token use ('id' or 'access')
 * @returns Verified token payload
 */
export async function verifyTokenFromHeader(
  authHeader: string | null,
  tokenUse: 'id' | 'access' = 'id'
): Promise<VerifiedTokenPayload> {
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with "Bearer "');
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  return verifyCognitoToken(token, tokenUse);
}

