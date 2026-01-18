import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientText } from "@/components/atoms/GradientText"
import { Settings, Palette, Type, Globe, Mail, Save, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { CONFIG } from "@/lib/config"

export function SiteSettingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user && CONFIG.ADMIN.EMAILS.includes(user.email?.toLowerCase())

  const [settings, setSettings] = useState({
    siteName: "RoninDesignz",
    siteDescription: "Portfolio of Ronin Beerwinkel",
    heroTitle: "Portfolio of Ronin Beerwinkel",
    heroSubtitle: "Where creative vision meets innovative design",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    accentColor: "#f5576c",
    contactEmail: "ronindesignz123@gmail.com",
    contactPhone: "(+27) 65 736 5099",
    location: "Cape Town, South Africa",
    enable3DScene: true,
    enableParallax: true
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      if (!isAdmin) {
        navigate('/')
        return
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate])

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('siteSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save to localStorage (in production, save to backend)
      localStorage.setItem('siteSettings', JSON.stringify(settings))
      
      // TODO: Save to backend API
      // await apiClient.updateSettings(settings)
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="relative z-10 min-h-screen pt-24">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="py-12 text-center">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-2">Access Denied</p>
              <p className="text-muted-foreground text-sm mb-4">
                Only the site administrator can access this page.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <GradientText>Site Settings</GradientText>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Customize your portfolio website
          </p>
        </section>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="Site name"
                />
              </div>
              <div className="space-y-2">
                <Label>Site Description</Label>
                <Input
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="Site description"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input
                  value={settings.heroTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Main hero title"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Input
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  placeholder="Hero subtitle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Settings */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Scheme
              </CardTitle>
              <CardDescription>Customize your site's color palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#667eea"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#764ba2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                      placeholder="#f5576c"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={settings.contactPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="(+27) 65 736 5099"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={settings.location}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Feature Toggles
              </CardTitle>
              <CardDescription>Enable or disable site features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>3D Scene Background</Label>
                  <p className="text-sm text-muted-foreground">Show 3D scene on login/signup pages</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable3DScene}
                  onChange={(e) => setSettings(prev => ({ ...prev, enable3DScene: e.target.checked }))}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Parallax Effects</Label>
                  <p className="text-sm text-muted-foreground">Enable parallax scrolling effects</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableParallax}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableParallax: e.target.checked }))}
                  className="w-5 h-5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
