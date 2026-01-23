import { useState, useMemo, useCallback, memo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/molecules/FormField"
import { ApiClient } from "@/lib/api-client"
import { CONFIG } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationMessage } from "@/components/atoms/ValidationMessage"

const apiClient = new ApiClient()

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim())

export const LoginForm = memo(function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isAdminEmail = useMemo(() => 
    email && ADMIN_EMAILS.includes(email.toLowerCase().trim()),
    [email]
  )

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError("")

    console.log('[LOGIN FORM] Submit triggered', { email, password: password ? '***' : '' })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:32',message:'Form submit triggered',data:{hasEmail:!!email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});

    // PRIORITY: Validate inputs immediately
    if (!email || !password) {
      setError("Please fill in all fields")
      console.log('[LOGIN FORM] Validation failed - missing fields')
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:40',message:'Validation failed',data:{hasEmail:!!email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      return
    }

    // PRIORITY: Admin login takes priority - show loading immediately
    setIsSubmitting(true)

    try {
      console.log('[LOGIN FORM] Making API call...')
      // PRIORITY: Sign in takes priority - make API call
      const response = await apiClient.login({ 
        email: email.trim().toLowerCase(), 
        password 
      })
      console.log('[LOGIN FORM] API response:', response)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:56',message:'API response received',data:{success:response.success,hasData:!!response.data,isAdmin:response.data?.isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion

      if (response.success) {
        const data = response.data || {}
        const member = data.member || {}
        
        // PRIORITY: Admin login takes priority - check admin status first
        // Double-check from multiple sources for reliability
        const isAdmin = data.isAdmin === true || member.isAdmin === true

        if (!member.id || !member.email) {
          setError("Invalid response from server. Please try again.")
          setIsSubmitting(false)
          return
        }

        // Verify admin status one more time from email (for consistency)
        const emailLower = member.email.toLowerCase().trim();
        const verifiedAdmin = isAdmin || ADMIN_EMAILS.includes(emailLower);

        const userData = {
          id: member.id,
          name: member.name || '',
          email: member.email,
          isAdmin: verifiedAdmin  // Use verified admin status
        }

        // Login user
        login(userData)

        // PRIORITY: Admin login takes priority - redirect admin first
        if (verifiedAdmin) {
          // Immediate redirect for admin - works every time
          console.log('[ADMIN LOGIN] Redirecting admin to dashboard');
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:87',message:'Admin redirect triggered',data:{verifiedAdmin,memberEmail:member.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
          // #endregion
          window.location.href = '/admin/messages'
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:92',message:'Regular user redirect',data:{verifiedAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
          // #endregion
          navigate('/contact', { replace: true })
        }
      } else {
        // Better error messages
        const errorMsg = response.message || "Invalid email or password"
        setError(errorMsg)
        setIsSubmitting(false)
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:95',message:'Login failed',data:{errorMsg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
        // #endregion
      }
    } catch (err) {
      // Enhanced error handling
      console.error('[LOGIN ERROR]', err)
      setError("Connection error. Please check your internet connection and try again.")
      setIsSubmitting(false)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.jsx:102',message:'Login exception',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
    }
  }, [email, password, login, navigate])

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl mb-2">
          {isAdminEmail ? 'Admin Login' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-base">
          {isAdminEmail 
            ? 'Sign in to access the admin dashboard' 
            : 'Sign in to your account to send messages'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-input/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})
