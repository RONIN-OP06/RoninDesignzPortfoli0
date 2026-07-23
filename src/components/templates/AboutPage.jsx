import { GradientText } from "@/components/atoms/GradientText"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Code2, Box, Palette, ArrowRight } from "lucide-react"

const SKILLS = [
  {
    icon: Code2,
    color: "text-red-400",
    title: "Web Development",
    items: ["React", "Vite", "Tailwind CSS", "Shadcn UI", "Three.js", "React Router", "Node.js", "Express.js", "Netlify Functions", "Responsive Design"],
  },
  {
    icon: Box,
    color: "text-purple-400",
    title: "3D & Visualisation",
    items: ["Blender", "3D Modelling", "3D Rendering", "Product Visualisation", "Architectural Visualisation", "Furniture Design", "Jewellery Design"],
  },
  {
    icon: Palette,
    color: "text-blue-400",
    title: "Design & Illustration",
    items: ["Figma", "UI/UX Design", "Digital Painting", "Concept Art", "Character Design", "Perspective Drawing", "Technical Drawing", "Digital Art"],
  },
]

export function AboutPage() {
  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <GradientText>Ronin Beerwinkel</GradientText>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Designer and developer based in Cape Town, working across web, 3D and illustration.
          </p>
        </section>

        {/* Story */}
        <section className="mb-16 sm:mb-20">
          <Card className="bg-card/40 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
              <p>
                I&apos;m Ronin Beerwinkel, a multidisciplinary designer and developer based in
                Cape Town, South Africa. I work across the full creative stack — from building
                responsive web applications in React to modelling and rendering 3D scenes in
                Blender and creating digital illustrations.
              </p>
              <p>
                I enjoy work that sits at the intersection of engineering and design: interfaces
                that are as considered visually as they are technically, and visuals built with
                real craft. I care about the details — clean, maintainable code, thoughtful UX,
                and polished output.
              </p>
              <p>
                I&apos;m currently open to freelance projects and full-time opportunities where I
                can bring both a developer&apos;s rigour and a designer&apos;s eye.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Skills & Tools */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <GradientText>Skills &amp; Tools</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The technologies and tools I use day to day, drawn from real project work.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SKILLS.map(({ icon: Icon, color, title, items }) => (
              <Card key={title} className="bg-card/40 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <Icon className={`w-10 h-10 ${color} mb-3`} />
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="text-sm px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground border border-border/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-10 border border-border/50">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Want to see the work?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Browse projects across web development, UI/UX, 3D and illustration.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" variant="gradient" className="text-base px-7 py-6">
                <Link to="/portfolio">
                  View portfolio <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-7 py-6">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
