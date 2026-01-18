import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/molecules/FormField"
import { FormValidator } from "@/lib/form-validator"
import { ApiClient } from "@/lib/api-client"
import { CONFIG } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationMessage } from "@/components/atoms/ValidationMessage"

const validator = new FormValidator()
const apiClient = new ApiClient()

export function SignUpForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })
  
  const [validation, setValidation] = useState({
    name: { isValid: null, message: "" },
    email: { isValid: null, message: "" },
    password: { isValid: null, message: "" },
    phone: { isValid: null, message: "" }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleFieldChange = useCallback((field, value) => {
    if (field === "phone") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10)
      setFormData(prev => ({ ...prev, [field]: cleanedValue }))
      
      const result = validator.validate(field, cleanedValue)
      setValidation(prev => ({
        ...prev,
        [field]: { isValid: result.isValid, message: result.message }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      const result = validator.validate(field, value)
      setValidation(prev => ({
        ...prev,
        [field]: { isValid: result.isValid, message: result.message }
      }))
    }
  }, [])

  const validateAll = () => {
    const newValidation = {}
    let allValid = true

    Object.keys(formData).forEach(field => {
      const result = validator.validate(field, formData[field])
      newValidation[field] = {
        isValid: result.isValid,
        message: result.message
      }
      if (!result.isValid) {
        allValid = false
      }
    })

    setValidation(newValidation)
    return allValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage("")

    if (!validateAll()) {
      setSubmitMessage(CONFIG.MESSAGES.ERROR_VALIDATION)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.registerMember({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      })

      if (response.success) {
        const userData = {
          id: response.data.member.id,
          name: response.data.member.name,
          email: response.data.member.email
        }
        login(userData)
        
        setSubmitMessage(`${CONFIG.MESSAGES.SUCCESS_PREFIX} ${formData.name}!`)
        setFormData({ name: "", email: "", password: "", phone: "" })
        setValidation({
          name: { isValid: null, message: "" },
          email: { isValid: null, message: "" },
          password: { isValid: null, message: "" },
          phone: { isValid: null, message: "" }
        })
        
        setTimeout(() => {
          navigate('/contact')
        }, 1500)
      } else {
        setSubmitMessage(response.message || "Registration failed. Please try again.")
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
        <CardTitle className="text-3xl mb-2">Get In Touch</CardTitle>
        <CardDescription className="text-base">
          Fill out the form below to connect with me about your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            validationMessage={validation.name.message}
            isValid={validation.name.isValid}
            required
          />

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
                placeholder="Create a strong password"
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

          <FormField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            validationMessage={validation.phone.message}
            isValid={validation.phone.isValid}
            maxLength={10}
            required
          />

          {submitMessage && (
            <div
              className={`p-4 rounded-lg ${
                submitMessage.includes("successfully")
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
            {isSubmitting ? CONFIG.MESSAGES.SUBMITTING : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


