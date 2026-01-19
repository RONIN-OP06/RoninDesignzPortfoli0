import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/molecules/FormField"
import { ApiClient } from "@/lib/api-client"
import { CONFIG } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationMessage } from "@/components/atoms/ValidationMessage"

const apiClient = new ApiClient()

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim())

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isAdminEmail = email && ADMIN_EMAILS.includes(email.toLowerCase().trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.login({ email, password })

      if (response.success) {
        const data = response.data || {}
        const member = data.member || {}
        const isAdmin = data.isAdmin === true || member.isAdmin === true

        if (!member.id || !member.email) {
          setError("Invalid response from server")
          return
        }

        const userData = {
          id: member.id,
          name: member.name || '',
          email: member.email,
          isAdmin: isAdmin
        }

        login(userData)

        if (isAdmin) {
          navigate('/admin/messages')
        } else {
          navigate('/contact')
        }
      } else {
        setError(response.message || "Invalid email or password")
      }
    } catch (err) {
      setError("Connection error. Please try again.")
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl mb-2">
          {isAdminEmail ? 'Admin Login' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-base">
          {isAdminEmail 
            ? 'Sign in to access the admin dashboard' 
            : 'Sign in to your account to send messages'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-input/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
