"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { confirmSignUp, resendSignUpCode, signUp, getCurrentUser } from '@/lib/cognitoActions'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'

export default function PartnerSignUp() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Check if user is already signed in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // User is already signed in, redirect to dashboard
          router.replace("/dashboard");
        }
      } catch {
        // User is not signed in, allow access to signup page
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const onSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const result = await signUp({ email, password })
      if (!result.isSignUpComplete) {
        setNeedsConfirmation(true)
        setMessage('Verification code sent to your email')
      } else {
        // User is automatically signed in - update global auth store
        setUser({ username: email })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Sign up failed')
      // setError("Some issue with SignUp Serviceaaaaa"?? 'Sign up failed')

    } finally {
      setLoading(false)
    }
  }

  const onSubmitConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      await confirmSignUp({ email, code })
      setMessage('Email verified. You can now sign in.')
      router.push('/partnerLogin')
    } catch (err: any) {
      setError(err?.message ?? 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setError(null)
    setMessage(null)
    try {
      await resendSignUpCode({ email })
      setMessage('Verification code resent')
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend code')
    }
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="w-full max-w-md mx-auto mt-12 p-6 border rounded-lg">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 border rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Partner Account</h1>

      {!needsConfirmation ? (
        <form onSubmit={onSubmitSignUp} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-700 text-sm">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      ) : (
        <form onSubmit={onSubmitConfirm} className="space-y-4">
          <Input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-700 text-sm">{message}</div>}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Verifying...' : 'Confirm Email'}
            </Button>
            <Button type="button" variant="outline" onClick={onResend}>Resend Code</Button>
          </div>
        </form>
      )}

      <div className="mt-4 text-sm">
        Already have an account?{' '}
        <Link className="text-purple-600" href="/partnerLogin">Sign In</Link>
      </div>
    </div>
  )
}
