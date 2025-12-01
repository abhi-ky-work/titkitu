"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, getCurrentUser } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

export default function PartnerLoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // User is not signed in, allow access to login page
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn({ email, password });
      console.log("result", result);
      if (result.isSignedIn) {
        // Update global auth store so Header and other components react immediately
        setUser({ username: email });
        router.push("/dashboard");
      } else {
        setError("Additional authentication step required.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

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
      <h1 className="text-2xl font-semibold mb-4">Partner Sign In</h1>
      <form onSubmit={onSubmit} className="space-y-4">
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <Link className="text-purple-600" href="/partnerSignup">Create an account</Link>
        <Link className="text-purple-600" href="/forgotPassword">Forgot password?</Link>
      </div>
    </div>
  );
}
