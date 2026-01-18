import { useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/molecules/FormField"
import { ApiClient } from "@/lib/api-client"
import { CONFIG } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { isAdminUser } from "@/lib/auth-utils"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationMessage } from "@/components/atoms/ValidationMessage"

const apiClient = new ApiClient()

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const [validation, setValidation] = useState({
    email: { isValid: null, message: "" },
    password: { isValid: null, message: "" }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidation(prev => ({
      ...prev,
      [field]: { isValid: null, message: "" }
    }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage("")

    if (!formData.email || !formData.password) {
      setSubmitMessage("Please fill in all fields.")
      setValidation({
        email: { isValid: false, message: formData.email ? "" : "Email is required" },
        password: { isValid: false, message: formData.password ? "" : "Password is required" }
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password
      })

      if (response.success) {
        const userData = {
          id: response.data.member.id,
          name: response.data.member.name,
          email: response.data.member.email
        }
        
        login(userData)
        
        const isAdmin = response.data.isAdmin !== undefined 
          ? response.data.isAdmin 
          : isAdminUser(userData)
        
        if (isAdmin) {
          setSubmitMessage("Admin login successful! Redirecting to dashboard...")
          setTimeout(() => {
            navigate('/admin/messages')
          }, 1000)
        } else {
          setSubmitMessage("Login successful! Redirecting...")
          setTimeout(() => {
            navigate('/contact')
          }, 1000)
        }
      } else {
        setSubmitMessage(response.message || "Invalid email or password. Please try again.")
        setValidation({
          email: { isValid: false, message: "" },
          password: { isValid: false, message: "" }
        })
      }
    } catch (error) {
      setSubmitMessage(CONFIG.MESSAGES.ERROR_CONNECTION)
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
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            validationMessage={validation.email.message}
            isValid={validation.email.isValid}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/90">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                required
                className="bg-background/50 border-input/50 focus-visible:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <ValidationMessage 
              message={validation.password.message} 
              isValid={validation.password.isValid} 
            />
          </div>

          {submitMessage && (
            <div
              className={`p-4 rounded-lg ${
                submitMessage.includes("successful")
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-red-500/20 text-red-400 border border-red-500/50"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? CONFIG.MESSAGES.SUBMITTING : "Sign In"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:underline font-medium"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
