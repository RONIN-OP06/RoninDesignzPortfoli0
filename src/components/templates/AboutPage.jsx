import { GradientText } from "@/components/atoms/GradientText"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Target, Users, Award } from "lucide-react"

export function AboutPage() {
  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <GradientText>About Me</GradientText>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Creative designer and developer passionate about bringing ideas to life through innovative design and technology.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">My Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                I'm Ronin Beerwinkel, a creative professional dedicated to transforming visions into reality.
                With a passion for design and development, I specialize in creating engaging digital experiences
                that combine aesthetic appeal with functional excellence.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're looking to build a brand, develop a web application, or create stunning visual content,
                I'm here to help bring your ideas to life with creativity, precision, and dedication.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <GradientText>What I Bring</GradientText>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <Heart className="w-10 h-10 text-red-400 mb-4" />
                <CardTitle>Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Passionate about design and committed to bringing your creative vision to life.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <Target className="w-10 h-10 text-purple-400 mb-4" />
                <CardTitle>Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Attention to detail and dedication to excellence in every project.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <Users className="w-10 h-10 text-blue-400 mb-4" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Working closely with clients to understand and realize their unique vision.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <Award className="w-10 h-10 text-yellow-400 mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Delivering cutting-edge solutions that stand out and make an impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}


