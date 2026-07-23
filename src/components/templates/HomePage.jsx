import { useMemo, memo } from "react"
import { ParallaxBackground } from "@/components/organisms/ParallaxBackground"
import { GradientText } from "@/components/atoms/GradientText"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, Code2, Box, Palette } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { CONFIG } from "@/lib/config"
import { AdminMessagesSection } from "@/components/organisms/AdminMessagesSection"
import { projects } from "@/data/projects"

const DISCIPLINES = [
  {
    icon: Code2,
    color: "text-red-400",
    title: "Web Development",
    body: "Full-stack React applications with clean, responsive interfaces — from component architecture and state to serverless APIs.",
  },
  {
    icon: Box,
    color: "text-purple-400",
    title: "3D & Visualisation",
    body: "Product, furniture and architectural visualisation, modelled and rendered in Blender with attention to materials and light.",
  },
  {
    icon: Palette,
    color: "text-blue-400",
    title: "Design & Illustration",
    body: "UI/UX design in Figma and digital illustration — concept art, character design and technical drawing.",
  },
]

const FALLBACK_IMG = "/images/projects/3d/Screenshot (5).png"

export const HomePage = memo(function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = useMemo(() =>
    isAuthenticated && user && CONFIG.ADMIN.EMAILS.includes(user.email?.toLowerCase()),
    [isAuthenticated, user]
  )

  // A curated selection across disciplines for the home page (falls back to the
  // first few if a title is ever renamed).
  const featured = useMemo(() => {
    const preferred = ["Redbull 3D Model", "Portfolio Website UI Design", "Self Portrait - Bias Self"]
    const picks = preferred.map(t => projects.find(p => p.title === t)).filter(Boolean)
    return picks.length === 3 ? picks : projects.filter(p => p.image).slice(0, 3)
  }, [])

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
        {/* Hero */}
        <section className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">
              Multidisciplinary Designer &amp; Developer
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.05]">
              <GradientText>Ronin Beerwinkel</GradientText>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              I design and build digital experiences — web apps, interfaces, 3D
              visualisations and illustration — with a focus on craft and detail.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" variant="gradient" className="text-base px-7 py-6">
                <Link to="/portfolio">
                  View my work <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-7 py-6">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What I do */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              <GradientText>What I Do</GradientText>
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">
              A blend of engineering and visual craft across four disciplines.
            </p>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {DISCIPLINES.map(({ icon: Icon, color, title, body }) => (
                <div
                  key={title}
                  className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border/50 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className={`w-11 h-11 ${color} mb-5`} />
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured work */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                  <GradientText>Featured Work</GradientText>
                </h2>
                <p className="text-muted-foreground">A few highlights from across my portfolio.</p>
              </div>
              <Button asChild variant="ghost" className="shrink-0">
                <Link to="/portfolio">
                  See all projects <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to={`/portfolio/${p.id}`}
                  className="group bg-card/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted/20">
                    <img
                      src={p.image || FALLBACK_IMG}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => { e.target.src = FALLBACK_IMG }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    {Array.isArray(p.technologies) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {p.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-secondary-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Open to opportunities */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center bg-card/40 backdrop-blur-xl rounded-3xl p-10 sm:p-14 border border-border/50">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-green-400 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Open to opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
              Let&apos;s work together
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              I&apos;m currently open to freelance projects and full-time roles. If you&apos;re building
              something and need a designer-developer, I&apos;d love to hear from you.
            </p>
            <Button asChild size="lg" variant="gradient" className="text-base px-7 py-6">
              <Link to="/contact">
                Get in touch <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
})
