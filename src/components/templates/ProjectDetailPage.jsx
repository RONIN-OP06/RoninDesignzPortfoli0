import { useParams, useNavigate, Link } from "react-router-dom"
import { GradientText } from "@/components/atoms/GradientText"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, CheckCircle2 } from "lucide-react"
import { getProjectById } from "@/data/projects"

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id)

  if (!project) {
    return (
      <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0 flex items-center justify-center">
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Project Not Found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/portfolio')} variant="gradient">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
              onError={(e) => {
                e.target.src = "/images/projects/3d/Screenshot (5).png"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {project.category && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">{project.category}</span>
                  </div>
                )}
                {project.date && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">{project.date}</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">
                <GradientText>{project.title}</GradientText>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                {project.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {project.liveLink && (
              <Button
                variant="gradient"
                asChild
                className="flex items-center gap-2"
              >
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Project
                </a>
              </Button>
            )}
            {project.githubLink && (
              <Button
                variant="outline"
                asChild
                className="flex items-center gap-2"
              >
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Challenges */}
            {project.challenges && (
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Challenges & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.challenges}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {project.results && (
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Results & Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.results}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies && project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm rounded-full bg-primary/20 text-primary border border-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Programming Languages */}
            {project.programming && project.programming.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Programming Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.programming.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Info */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.category && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <div className="font-medium">{project.category}</div>
                  </div>
                )}
                {project.date && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date</div>
                    <div className="font-medium">{project.date}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardContent className="pt-6">
                <Link
                  to="/portfolio"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>View All Projects</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
