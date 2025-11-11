/**
 * Utility to manually fetch and inspect Cognito's JWKS (JSON Web Key Set)
 * This is for debugging/inspection purposes only.
 * The jose library handles this automatically in verifyToken.ts
 */

export interface JWK {
  kid: string;
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

export interface JWKSResponse {
  keys: JWK[];
}

/**
 * Fetches Cognito's JWKS (public keys) for inspection
 * @param userPoolId - Your Cognito User Pool ID
 * @param region - AWS region (default: us-east-1)
 * @returns JWKS response with public keys
 */
export async function fetchCognitoJWKS(
  userPoolId: string,
  region: string = 'us-east-1'
): Promise<JWKSResponse> {
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  
  const response = await fetch(jwksUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
  }
  
  const jwks = await response.json();
  return jwks as JWKSResponse;
}

/**
 * Gets the JWKS URL for a given User Pool
 */
export function getJWKSUrl(userPoolId: string, region: string = 'us-east-1'): string {
  return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
}

/**
 * Example usage in a Next.js API route (for debugging):
 * 
 * // app/api/inspect-jwks/route.ts
 * import { fetchCognitoJWKS } from '@/lib/inspectJWKS';
 * 
 * export async function GET() {
 *   const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID!;
 *   const region = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
 *   
 *   try {
 *     const jwks = await fetchCognitoJWKS(userPoolId, region);
 *     return Response.json(jwks);
 *   } catch (error) {
 *     return Response.json({ error: 'Failed to fetch JWKS' }, { status: 500 });
 *   }
 * }
 */

