import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await login(email, password);
      signIn(token, {
        id: user.id,
        name: user.name,
        role: user.role as UserRole,
        email: user.email,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-[#030213] rounded-xl">
            <Zap className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold text-[#0a0a0a]">DevPortal</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-black/8 rounded-xl shadow-sm p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-lg font-semibold text-[#0a0a0a]">Sign in</h1>
            <p className="text-sm text-[#717182]">
              Enter your credentials to access the portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-[#0a0a0a]"
              >
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-[#0a0a0a]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#0a0a0a] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-[#030213] text-sm font-medium text-white hover:bg-[#030213]/90 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="pt-2 border-t border-black/5">
            <p className="text-xs text-[#717182] text-center">
              Demo credentials&nbsp;&mdash;&nbsp;
              <span className="font-medium">alice@devportal.io</span>
              {" / "}
              <span className="font-medium">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
