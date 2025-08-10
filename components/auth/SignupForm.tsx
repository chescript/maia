"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const supabase = createClient();
  const router = useRouter();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // Since email confirmation is disabled, redirect directly to dashboard
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">M</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Create your account
        </h1>
        <p className="text-gray-600 mt-2">Join thousands of learners on Maia</p>
      </div>

      <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Create a password"
                required
                disabled={loading}
                minLength={6}
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Password strength:</span>
                  <span
                    className={`font-medium ${
                      passwordStrength < 25
                        ? "text-red-600"
                        : passwordStrength < 50
                        ? "text-orange-600"
                        : passwordStrength < 75
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password should contain:</p>
                  <ul className="space-y-1 ml-2">
                    <li
                      className={
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      • At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      • One uppercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      • One number
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      • One special character
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Privacy */}
          <div className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm animate-in slide-in-from-top-1 duration-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            disabled={loading || passwordStrength < 50}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-12 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in instead
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
