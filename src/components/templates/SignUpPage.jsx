import { Header } from "@/components/molecules/Header"
import { SignUpForm } from "@/components/organisms/SignUpForm"

export function SignUpPage() {
  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Header />
        <div className="mt-12">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}


