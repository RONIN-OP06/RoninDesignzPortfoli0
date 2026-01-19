import { LoginForm } from "@/components/organisms/LoginForm"

export function LoginPage() {
  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <LoginForm />
      </div>
    </div>
  )
}
