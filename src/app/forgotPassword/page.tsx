"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { confirmForgotPassword, forgotPassword, getCurrentUser } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState<"request" | "confirm">("request");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
        // User is not signed in, allow access to forgot password page
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const onRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      setStage("confirm");
      setMessage("Verification code sent to your email");
    } catch (err: any) {
      setError(err?.message ?? "Failed to start reset");
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await confirmForgotPassword({ email, code, newPassword });
      setMessage("Password reset successful. You can now sign in.");
    } catch (err: any) {
      setError(err?.message ?? "Failed to reset password");
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
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      {stage === "request" ? (
        <form onSubmit={onRequest} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-700 text-sm">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending code..." : "Send Reset Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={onConfirm} className="space-y-4">
          <Input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-700 text-sm">{message}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
      <div className="mt-4 text-sm">
        <Link className="text-purple-600" href="/partnerLogin">Back to Sign In</Link>
      </div>
    </div>
  );
}


