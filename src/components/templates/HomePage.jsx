import { useMemo, memo } from "react"
import { ParallaxBackground } from "@/components/organisms/ParallaxBackground"
import { GradientText } from "@/components/atoms/GradientText"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, Zap, Target, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { CONFIG } from "@/lib/config"
import { AdminMessagesSection } from "@/components/organisms/AdminMessagesSection"

export const HomePage = memo(function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = useMemo(() => 
    isAuthenticated && user && CONFIG.ADMIN.EMAILS.includes(user.email?.toLowerCase()),
    [isAuthenticated, user]
  )

  // if admin, show messages instead of normal home
  if (isAdmin) {
    return (
      <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
        <AdminMessagesSection />
      </div>
    )
  }

  return (
    <>
      <ParallaxBackground />
      <div className="relative z-[2] min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black mb-6 leading-tight">
              <GradientText>Portfolio of Ronin Beerwinkel</GradientText>
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-foreground/90 mb-8 max-w-3xl mx-auto">
              Where <span className="text-red-400 font-bold">creative</span> vision meets
              <span className="text-blue-400 font-bold"> innovative</span> design
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" variant="gradient" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                <Link to="/portfolio">
                  See my work <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
              <GradientText>What I Do</GradientText>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <Zap className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">CREATIVE DESIGN</h3>
                <p className="text-muted-foreground">
                  Innovative and eye-catching designs that capture attention and communicate your message effectively.
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <Target className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">DEVELOPMENT</h3>
                <p className="text-muted-foreground">
                  Building robust and scalable solutions using the latest technologies and best practices.
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">COLLABORATION</h3>
                <p className="text-muted-foreground">
                  Working closely with clients to understand their vision and bring it to life through creative collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center bg-card/50 backdrop-blur-xl rounded-3xl p-12 border border-border/50">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Let's work together to bring your ideas to life. Get in touch and let's create something amazing.
            </p>
            <Button asChild size="lg" variant="gradient" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              <Link to="/contact">
                Contact Me <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
})


