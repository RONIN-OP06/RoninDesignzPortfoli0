import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/molecules/FormField"
import { ApiClient } from "@/lib/api-client"
import { CONFIG } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { Send, Mail } from "lucide-react"

const apiClient = new ApiClient()

export function ContactForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user])

  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage("")

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage("Please fill in all fields.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })

      if (response.success) {
        setSubmitMessage("Message sent successfully! I'll get back to you soon.")
        setFormData(prev => ({
          ...prev,
          subject: "",
          message: ""
        }))
      } else {
        setSubmitMessage(response.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setSubmitMessage(CONFIG.MESSAGES.ERROR_CONNECTION)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="text-3xl mb-2 flex items-center gap-2">
          <Mail className="w-8 h-8 text-red-400" />
          Send a Message
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the form below and I'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="name"
            label="Your Name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            required
            disabled={!!user?.name}
          />

          <FormField
            id="email"
            label="Your Email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            required
            disabled={!!user?.email}
          />

          <FormField
            id="subject"
            label="Subject"
            type="text"
            placeholder="What is this regarding?"
            value={formData.subject}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            required
          />

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground/90">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              required
              rows={6}
              className="w-full px-3 py-2 bg-background/50 border border-input/50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 resize-none"
            />
          </div>

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
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
