import { GradientText } from "@/components/atoms/GradientText"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "@/components/organisms/ContactForm"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function ContactPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <GradientText>Contact Me</GradientText>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with me. I'm here to help bring your ideas to life.
          </p>
        </section>

        {/* Contact Form - Only for authenticated users */}
        {isAuthenticated ? (
          <div className="max-w-3xl mx-auto mb-16">
            <ContactForm />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardContent className="py-12">
                <p className="text-lg text-muted-foreground mb-6">
                  Please sign in or create an account to send me a message.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="gradient">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl mb-4 text-center">Other Ways to Reach Me</CardTitle>
              <CardDescription className="text-center text-lg">
                You can also reach out through these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 py-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="p-4 bg-red-500/20 rounded-lg">
                  <Mail className="w-8 h-8 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Email</h3>
                  <a 
                    href="mailto:ronindesignz123@gmail.com"
                    className="text-primary hover:underline text-lg"
                  >
                    ronindesignz123@gmail.com
                  </a>
                  <p className="text-muted-foreground mt-2">
                    Send me an email directly using your email client.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="p-4 bg-purple-500/20 rounded-lg">
                  <Phone className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Phone</h3>
                  <a 
                    href="tel:+27657365099"
                    className="text-primary hover:underline text-lg"
                  >
                    (+27) 65 736 5099
                  </a>
                  <p className="text-muted-foreground mt-2">
                    Call or send a message via WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="p-4 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Location</h3>
                  <p className="text-lg">
                    Cape Town, South Africa
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Available for remote and local projects worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
