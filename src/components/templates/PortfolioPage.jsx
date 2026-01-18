import { useState, useMemo, useCallback, memo } from "react"
import { GradientText } from "@/components/atoms/GradientText"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Palette, Globe, Image as ImageIcon, Calendar, ArrowRight, X, Play, ChevronLeft, ChevronRight, Terminal, Edit2, Tag, ExternalLink, Github, CheckCircle2 } from "lucide-react"
import { projects } from "@/data/projects"
import { useAuth } from "@/contexts/AuthContext"
import { isAdminUser } from "@/lib/auth-utils"
import { ProjectUploadTile } from "@/components/organisms/ProjectUploadTile"
import { ProjectEditor } from "@/components/organisms/ProjectEditor"

const programs = [
  {
    title: "Web Development",
    description: "Custom web applications and interactive experiences built with modern technologies.",
    icon: Code,
    color: "text-red-400",
    category: "Web Development"
  },
  {
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces designed with user experience in mind.",
    icon: Palette,
    color: "text-purple-400",
    category: "UI/UX Design"
  },
  {
    title: "3D Design & Modeling",
    description: "Stunning 3D visuals and interactive 3D experiences using cutting-edge tools.",
    icon: Globe,
    color: "text-blue-400",
    category: "3D Design"
  },
  {
    title: "2D Illustration & Animations",
    description: "Creative 2D illustrations, animations, and visual storytelling that bring ideas to life.",
    icon: ImageIcon,
    color: "text-green-400",
    category: "2D Illustration & Animations"
  },
  {
    title: "Programming & Software Development",
    description: "Robust software solutions, APIs, and backend systems built with modern programming languages and best practices.",
    icon: Terminal,
    color: "text-yellow-400",
    category: "Programming & Software Development"
  }
]

// memoized project card component
const ProjectCard = memo(({ project, isAdmin, onSelect, onEdit }) => {
  const isVideo = project.mediaType === "video" && project.video
  const thumbnail = project.image || (isVideo ? "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop" : "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop")
  
  return (
    <Card
      className="bg-card/30 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full cursor-pointer relative"
      onClick={(e) => {
        if (e.target.closest('.edit-button')) return
        onSelect(project)
      }}
    >
      {isAdmin && (
        <button
          className="edit-button absolute top-2 right-2 z-10 p-2 bg-background/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border/50"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(project)
          }}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      <div className="relative overflow-hidden">
        {isVideo ? (
          <>
            <img
              src={thumbnail}
              alt={project.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-12 h-12 fill-white text-white opacity-80" />
            </div>
          </>
        ) : (
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isVideo ? (
            <Play className="w-4 h-4 fill-white text-white" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          {project.date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <Calendar className="w-3 h-3" />
              {project.date}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {project.description}
        </CardDescription>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'

export function PortfolioPage() {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = isAuthenticated && isAdminUser(user)
  
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [videoError, setVideoError] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [showNewProject, setShowNewProject] = useState(false)

  // memoized category projects
  const projectsByCategory = useMemo(() => {
    const map = new Map()
    programs.forEach(program => {
      map.set(program.category, projects.filter(p => p.category === program.category))
    })
    return map
  }, [])

  // memoized callbacks
  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project)
    setSelectedMediaIndex(0)
    setVideoError(null)
  }, [])

  const handleProjectEdit = useCallback((project) => {
    setEditingProject(project)
  }, [])

  // get projects by category (memoized)
  const getProjectsByCategory = useCallback((category) => {
    return projectsByCategory.get(category) || []
  }, [projectsByCategory])

  // get media for project with error handling
  const getProjectMedia = useCallback((project) => {
    if (!project) return []
    
    try {
      if (project.media && Array.isArray(project.media) && project.media.length > 0) {
        // Validate and filter media array
        return project.media.filter(m => m && m.url && (m.type === "image" || m.type === "video" || m.type === "iframe"))
      }
      
      const media = []
      if (project.image && typeof project.image === "string" && project.image.trim()) {
        media.push({ type: "image", url: project.image.trim() })
      }
      if (project.video && typeof project.video === "string" && project.video.trim()) {
        media.push({ type: "video", url: project.video.trim() })
      }
      return media
    } catch (error) {
      console.error("Error parsing project media:", error, project)
      return []
    }
  }, [])

  // convert video url to embed format
  const getVideoEmbedUrl = useCallback((videoUrl) => {
    if (!videoUrl) return null
    
    if (videoUrl.includes('youtube.com/watch?v=')) {
      return videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')
    }
    if (videoUrl.includes('youtu.be/')) {
      return videoUrl.replace('youtu.be/', 'youtube.com/embed/')
    }
    if (videoUrl.includes('youtube.com/embed/')) {
      return videoUrl
    }
    
    if (videoUrl.includes('vimeo.com/')) {
      const vimeoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0]
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}`
      }
    }
    if (videoUrl.includes('player.vimeo.com')) {
      return videoUrl
    }
    
    return videoUrl
  }, [])

  return (
    <div className="relative z-10 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* header */}
        <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <GradientText>My Projects</GradientText>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my work, creativity, and technical expertise
          </p>
        </section>

        {/* programs grid */}
        <section className="mb-20">
          <div className="space-y-12">
            {programs.map((program) => {
              const Icon = program.icon
              const categoryProjects = getProjectsByCategory(program.category)
              
              return (
                <div key={program.category} className="space-y-6">
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <Icon className={`w-12 h-12 ${program.color}`} />
                        <div>
                          <CardTitle className="text-3xl">{program.title}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {program.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* projects */}
                      {categoryProjects.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No projects in this category yet.
                        </p>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                          {/* Upload tile for admin */}
                          {isAdmin && (
                            <ProjectUploadTile
                              category={program.category}
                              onUpload={(fileData) => {
                                // create new project from uploaded file
                                setShowNewProject(true)
                                setEditingProject({
                                  title: "",
                                  description: "",
                                  category: program.category,
                                  image: fileData.type === 'image' ? fileData.url : "",
                                  video: fileData.type === 'video' ? fileData.url : null,
                                  media: [{ type: fileData.type, url: fileData.url }]
                                })
                              }}
                            />
                          )}
                          {categoryProjects.map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              isAdmin={isAdmin}
                              onSelect={handleProjectSelect}
                              onEdit={handleProjectEdit}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </section>

        {/* Project Detail Modal */}
        {selectedProject && (() => {
          const projectMedia = getProjectMedia(selectedProject)
          const currentMedia = projectMedia[selectedMediaIndex] || projectMedia[0]
          
          if (!currentMedia) return null
          
          return (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                setSelectedProject(null)
                setSelectedMediaIndex(0)
              }}
            >
              <div 
                className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl border border-border/50 shadow-2xl mt-16"
                onClick={(e) => e.stopPropagation()}
              >
                {/* close button */}
                <button
                  onClick={() => {
                    setSelectedProject(null)
                    setSelectedMediaIndex(0)
                  }}
                  className="fixed top-20 right-6 z-[101] p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 shadow-lg transition-all hover:scale-110"
                  aria-label="Close project details"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Project Detail Content */}
                <div className="relative">
                  {/* Main Media Display - Full Width, No Overlay */}
                  <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-gradient-to-br from-background via-background to-background overflow-hidden">
                    {currentMedia && (
                      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                        {currentMedia.type === "video" ? (
                          <>
                            {getVideoEmbedUrl(currentMedia.url)?.includes('embed') || getVideoEmbedUrl(currentMedia.url)?.includes('player.vimeo.com') ? (
                              // YouTube or Vimeo embed
                              <iframe
                                src={getVideoEmbedUrl(currentMedia.url)}
                                className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] rounded-lg shadow-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                title={selectedProject.title}
                                frameBorder="0"
                                loading="lazy"
                                onError={(e) => {
                                  console.error("Iframe load error:", e)
                                  setVideoError({ code: 0, message: "Failed to load embedded video" })
                                }}
                              />
                            ) : (
                              // local video
                              <>
                                {videoError ? (
                                  // error state
                                  <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center bg-background/50 rounded-lg">
                                    {selectedProject.image && (
                                      <img
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-contain opacity-30"
                                      />
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                      <div className="bg-background/95 backdrop-blur-md rounded-lg p-6 max-w-md border border-red-500/50">
                                        <h3 className="text-xl font-bold text-red-400 mb-2">Video Playback Error</h3>
                                        <p className="text-muted-foreground mb-4">
                                          The video file format is not supported by your browser. The video may need to be re-encoded in a web-compatible format (H.264/AAC).
                                        </p>
                                        <button
                                          onClick={() => {
                                            setVideoError(null)
                                            // reload video
                                            const video = document.querySelector('video')
                                            if (video) {
                                              video.load()
                                            }
                                          }}
                                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                          Try Again
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <video
                                    key={currentMedia.url}
                                    src={currentMedia.url}
                                    className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] object-contain rounded-lg shadow-2xl"
                                    controls
                                    controlsList="play pause volume fullscreen"
                                    preload="metadata"
                                    poster={selectedProject.image}
                                    playsInline
                                    webkit-playsinline="true"
                                    onError={(e) => {
                                      console.error("Video playback error:", e)
                                      const video = e.target
                                      const error = video.error
                                      
                                      // set error
                                      setVideoError({
                                        code: error?.code,
                                        message: error?.message || "Unknown video error"
                                      })
                                    }}
                                    onLoadedData={() => {
                                      setVideoError(null)
                                    }}
                                    onCanPlay={() => {
                                      setVideoError(null)
                                    }}
                                    onLoadedMetadata={() => {
                                      setVideoError(null)
                                    }}
                                  >
                                    <source src={currentMedia.url} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
                                    <source src={currentMedia.url} type="video/mp4" />
                                    <source src={currentMedia.url} type="video/webm" />
                                    Your browser does not support the video tag. Please try a different browser.
                                  </video>
                                )}
                              </>
                            )}
                          </>
                        ) : currentMedia.type === "iframe" ? (
                          // iframe display for HTML mockups
                          <iframe
                            src={currentMedia.url}
                            className="w-full h-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] rounded-lg shadow-2xl border border-border/50"
                            title={currentMedia.title || selectedProject.title}
                            frameBorder="0"
                            loading="lazy"
                            style={{ backgroundColor: '#0a0a0a' }}
                          />
                        ) : (
                          // image display
                          <img
                            src={currentMedia.url}
                            alt={selectedProject.title}
                            className="max-w-full max-h-[600px] md:max-h-[700px] lg:max-h-[800px] w-auto h-auto object-contain rounded-lg shadow-2xl"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
                            }}
                          />
                        )}
                      </div>
                    )}
                    
                    {/* nav arrows */}
                    {projectMedia.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMediaIndex((prev) => (prev > 0 ? prev - 1 : projectMedia.length - 1))
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/95 backdrop-blur-md hover:bg-background border-2 border-primary/50 shadow-xl transition-all hover:scale-110 hover:border-primary"
                          aria-label="Previous media"
                        >
                          <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMediaIndex((prev) => (prev < projectMedia.length - 1 ? prev + 1 : 0))
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/95 backdrop-blur-md hover:bg-background border-2 border-primary/50 shadow-xl transition-all hover:scale-110 hover:border-primary"
                          aria-label="Next media"
                        >
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </button>
                        {/* media counter */}
                        <div className="absolute top-4 left-4 z-20 px-4 py-2 rounded-full bg-background/95 backdrop-blur-md border-2 border-primary/50 shadow-xl text-sm font-semibold">
                          {selectedMediaIndex + 1} / {projectMedia.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* project title and info */}
                  <div className="px-6 md:px-8 pt-6 pb-4 bg-background">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {selectedProject.category && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                          <Tag className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">{selectedProject.category}</span>
                        </div>
                      )}
                      {selectedProject.date && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/20">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-semibold text-blue-400">{selectedProject.date}</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3">
                      <GradientText>{selectedProject.title}</GradientText>
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>

                {/* media gallery */}
                {projectMedia.length > 1 && (
                  <div className="px-6 pt-4 pb-2 bg-background/50">
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Media Gallery ({projectMedia.length} items)</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                      {projectMedia.map((media, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMediaIndex(index)
                          }}
                          className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedMediaIndex === index
                              ? "border-primary scale-105"
                              : "border-border/50 hover:border-primary/50"
                          }`}
                        >
                          {media.type === "video" ? (
                            <div className="relative w-full h-full bg-black">
                              <img
                                src={selectedProject.image}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover opacity-60"
                              />
                              <Play className="absolute inset-0 m-auto w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <img
                              src={media.url}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=200&fit=crop"
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* action buttons */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {selectedProject.liveLink && selectedProject.liveLink !== "#" && (
                      <Button
                        variant="gradient"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Live Project
                        </a>
                      </Button>
                    )}
                    {selectedProject.githubLink && selectedProject.githubLink !== "#" && (
                      <Button
                        variant="outline"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* main content */}
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                      {/* project overview */}
                      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                        <CardHeader>
                          <CardTitle className="text-2xl">Project Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                            {selectedProject.longDescription || selectedProject.description}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Features */}
                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                          <CardHeader>
                            <CardTitle className="text-2xl">Key Features</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-4">
                              {selectedProject.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* challenges */}
                      {selectedProject.challenges && (
                        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                          <CardHeader>
                            <CardTitle className="text-2xl">Challenges & Solutions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {selectedProject.challenges}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* results */}
                      {selectedProject.results && (
                        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                          <CardHeader>
                            <CardTitle className="text-2xl">Results & Impact</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {selectedProject.results}
                              <p>
                                
                              </p>
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
                            {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
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

                      {/* programming languages */}
                      {selectedProject.programming && selectedProject.programming.length > 0 && (
                        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                          <CardHeader>
                            <CardTitle className="text-xl">Programming Languages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.programming.map((lang, index) => (
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* stats */}
        <section className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-border/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <GradientText>My Experience</GradientText>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-red-400 mb-2">{projects.length}+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">1+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-muted-foreground">Available for Projects</div>
            </div>
          </div>
        </section>

        {/* Project Editor Modal */}
        {(editingProject || showNewProject) && (
          <ProjectEditor
            projectId={editingProject?.id || null}
            onClose={() => {
              setEditingProject(null)
              setShowNewProject(false)
            }}
            onSave={(projectData) => {
              setEditingProject(null)
              setShowNewProject(false)
            }}
            onDelete={(projectId) => {
              setEditingProject(null)
              setShowNewProject(false)
            }}
          />
        )}
      </div>
    </div>
  )
}


