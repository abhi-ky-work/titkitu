'use client'

import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession as amplifyFetchAuthSession,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  type SignInOutput,
} from 'aws-amplify/auth';

export async function signUp(params: { email: string; password: string }): Promise<{ isSignUpComplete: boolean; nextStep: any }>{
  const { email, password } = params;
  const result = await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
      autoSignIn: true,
    },
  });
  return { isSignUpComplete: result.isSignUpComplete, nextStep: result.nextStep };
}

export async function confirmSignUp(params: { email: string; code: string }): Promise<{ isSignUpComplete: boolean; nextStep: any }>{
  const { email, code } = params;
  const result = await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  return { isSignUpComplete: result.isSignUpComplete, nextStep: result.nextStep };
}

export async function resendSignUpCode(params: { email: string }): Promise<void> {
  await amplifyResendSignUpCode({ username: params.email });
}

export async function signIn(params: { email: string; password: string }): Promise<SignInOutput> {
  const { email, password } = params;
  const result = await amplifySignIn({ username: email, password });
  return result;
}

export async function signOut(): Promise<void> {
  await amplifySignOut();
}

export async function getCurrentUser(): Promise<{ username: string } | null> {
  try {
    const user = await amplifyGetCurrentUser();
    return { username: user.username };
  } catch {
    return null;
  }
}

export async function getSessionTokens(): Promise<{ idToken?: string; accessToken?: string } | null> {
  try {
    const session = await amplifyFetchAuthSession();
    return {
      idToken: session.tokens?.idToken?.toString(),
      accessToken: session.tokens?.accessToken?.toString(),
    };
  } catch {
    return null;
  }
}

export async function logTokenDetails(): Promise<void> {
  try {
    const session = await amplifyFetchAuthSession();
    console.group('🔐 Cognito Auth Token Details');
    console.log('ID Token Payload:', session.tokens?.idToken?.payload);
    console.log('Access Token Payload:', session.tokens?.accessToken?.payload);
    
    const idGroups = session.tokens?.idToken?.payload?.['cognito:groups'];
    const accessGroups = session.tokens?.accessToken?.payload?.['cognito:groups'];
    console.log('Groups (ID Token):', idGroups || 'None');
    console.log('Groups (Access Token):', accessGroups || 'None');
    console.groupEnd();
  } catch (err) {
    console.error('Failed to fetch auth session for logging', err);
  }
}

export async function forgotPassword(params: { email: string }): Promise<void> {
  await amplifyResetPassword({ username: params.email });
}

export async function confirmForgotPassword(params: { email: string; code: string; newPassword: string }): Promise<void> {
  const { email, code, newPassword } = params;
  await amplifyConfirmResetPassword({ username: email, confirmationCode: code, newPassword });
}


