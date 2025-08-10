import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-32 right-16 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 left-16 w-28 h-28 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-700" />
      <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-300" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  );
}
