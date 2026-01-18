import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Save, Trash2 } from "lucide-react"
import { projects, getProjectById } from "@/data/projects"
import { ApiClient } from "@/lib/api-client"

const apiClient = new ApiClient()

const categories = [
  "Web Development",
  "UI/UX Design",
  "3D Design",
  "2D Illustration & Animations",
  "Programming & Software Development"
]

export function ProjectEditor({ projectId, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    technologies: [],
    programming: [],
    features: [],
    challenges: "",
    results: "",
    date: "",
    liveLink: "",
    githubLink: "",
    image: "",
    video: null,
    media: []
  })

  const [techInput, setTechInput] = useState("")
  const [progInput, setProgInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")

  useEffect(() => {
    if (projectId) {
      const project = getProjectById(projectId)
      if (project) {
        setFormData({
          title: project.title || "",
          description: project.description || "",
          longDescription: project.longDescription || "",
          category: project.category || "",
          technologies: project.technologies || [],
          programming: project.programming || [],
          features: project.features || [],
          challenges: project.challenges || "",
          results: project.results || "",
          date: project.date || "",
          liveLink: project.liveLink || "",
          githubLink: project.githubLink || "",
          image: project.image || "",
          video: project.video || null,
          media: project.media || []
        })
      }
    }
  }, [projectId])

  const handleSave = async () => {
    try {
      const response = await apiClient.saveProject({ ...formData, id: projectId })
      if (response.success) {
        if (onSave) {
          onSave(response.data?.project || { ...formData, id: projectId })
        }
        onClose()
        // reload to see changes
        window.location.reload()
      } else {
        alert(response.message || 'Failed to save project')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save project')
    }
  }

  const addTech = useCallback(() => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput("")
    }
  }, [techInput])

  const removeTech = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }, [])

  const addProg = useCallback(() => {
    if (progInput.trim()) {
      setFormData(prev => ({
        ...prev,
        programming: [...prev.programming, progInput.trim()]
      }))
      setProgInput("")
    }
  }, [progInput])

  const removeProg = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      programming: prev.programming.filter((_, i) => i !== index)
    }))
  }, [])

  const addFeature = useCallback(() => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }))
      setFeatureInput("")
    }
  }, [featureInput])

  const removeFeature = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{projectId ? "Edit Project" : "New Project"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project title"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Short Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description"
            />
          </div>

          <div className="space-y-2">
            <Label>Long Description</Label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              placeholder="Detailed description"
              rows={4}
              className="w-full px-3 py-2 bg-background border border-input rounded-md resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="Add technology"
              />
              <Button type="button" onClick={addTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button onClick={() => removeTech(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Programming Languages</Label>
            <div className="flex gap-2">
              <Input
                value={progInput}
                onChange={(e) => setProgInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProg())}
                placeholder="Add language"
              />
              <Button type="button" onClick={addProg}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.programming.map((prog, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
                >
                  {prog}
                  <button onClick={() => removeProg(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="Add feature"
              />
              <Button type="button" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2"
                >
                  {feature}
                  <button onClick={() => removeFeature(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="/images/projects/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Live Link</Label>
              <Input
                value={formData.liveLink}
                onChange={(e) => setFormData(prev => ({ ...prev, liveLink: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub Link</Label>
              <Input
                value={formData.githubLink}
                onChange={(e) => setFormData(prev => ({ ...prev, githubLink: e.target.value }))}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Challenges</Label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
              placeholder="Describe challenges faced"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Results</Label>
            <textarea
              value={formData.results}
              onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
              placeholder="Describe results achieved"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            {projectId && onDelete && (
              <Button variant="destructive" onClick={async () => {
                if (confirm('Are you sure you want to delete this project?')) {
                  try {
                    const response = await apiClient.deleteProject(projectId)
                    if (response.success) {
                      onDelete(projectId)
                      onClose()
                      window.location.reload()
                    } else {
                      alert(response.message || 'Failed to delete project')
                    }
                  } catch (error) {
                    console.error('Delete error:', error)
                    alert('Failed to delete project')
                  }
                }
              }}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
