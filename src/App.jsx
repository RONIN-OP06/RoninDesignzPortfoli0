import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Suspense, lazy } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navigation } from "@/components/molecules/Navigation"

// lazy load pages for code splitting
const HomePage = lazy(() => import("@/components/templates/HomePage").then(m => ({ default: m.HomePage })))
const AboutPage = lazy(() => import("@/components/templates/AboutPage").then(m => ({ default: m.AboutPage })))
const PortfolioPage = lazy(() => import("@/components/templates/PortfolioPage").then(m => ({ default: m.PortfolioPage })))
const ProjectDetailPage = lazy(() => import("@/components/templates/ProjectDetailPage").then(m => ({ default: m.ProjectDetailPage })))
const ContactPage = lazy(() => import("@/components/templates/ContactPage").then(m => ({ default: m.ContactPage })))
const SignUpPage = lazy(() => import("@/components/templates/SignUpPage").then(m => ({ default: m.SignUpPage })))
const LoginPage = lazy(() => import("@/components/templates/LoginPage").then(m => ({ default: m.LoginPage })))
const AdminMessagesPage = lazy(() => import("@/components/templates/AdminMessagesPage").then(m => ({ default: m.AdminMessagesPage })))
const SiteSettingsPage = lazy(() => import("@/components/templates/SiteSettingsPage").then(m => ({ default: m.SiteSettingsPage })))
const ThreeJSScene = lazy(() => import("@/components/organisms/ThreeJSScene").then(m => ({ default: m.ThreeJSScene })))

// loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

function AppContent() {
  const location = useLocation()
  // only show 3d scene on signup/login pages
  const showThreeScene = location.pathname === "/signup" || location.pathname === "/login"

  return (
    <>
      {showThreeScene && (
        <Suspense fallback={null}>
          <ThreeJSScene />
        </Suspense>
      )}
      <div className={`min-h-screen antialiased ${location.pathname === '/' ? '' : 'bg-background'}`}>
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/messages" element={<AdminMessagesPage />} />
            <Route path="/admin/settings" element={<SiteSettingsPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
