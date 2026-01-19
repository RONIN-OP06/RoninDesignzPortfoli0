import { Link, useLocation } from "react-router-dom"
import { memo, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Home, User, Briefcase, Mail, UserPlus, LogOut, LogIn, Inbox, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { isAdminUser } from "@/lib/auth-utils"

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: User },
  { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  { path: "/contact", label: "Contact", icon: Mail, hideForAdmin: true },
]

export const Navigation = memo(function Navigation() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const adminUser = useMemo(() => isAdminUser(user), [user])
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => !(item.hideForAdmin && adminUser))
  }, [adminUser])

  // Add admin messages to nav items for mobile bottom bar
  const allNavItems = useMemo(() => {
    const items = [...filteredNavItems]
    if (isAuthenticated && adminUser) {
      items.push({ path: "/admin/messages", label: "Messages", icon: Inbox })
    }
    if (!isAuthenticated) {
      items.push({ path: "/login", label: "Login", icon: LogIn })
      items.push({ path: "/signup", label: "Sign Up", icon: UserPlus })
    }
    return items
  }, [filteredNavItems, isAuthenticated, adminUser])

  return (
    <>
    {/* Top Navigation - Desktop Only */}
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 bg-clip-text text-transparent shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            RoninDezigns
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                {adminUser && (
                  <Link
                    to="/admin/messages"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]",
                      location.pathname === "/admin/messages"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Inbox className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground px-2">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]",
                    location.pathname === "/login"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]",
                    location.pathname === "/signup"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <div className="flex flex-col gap-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 min-h-[48px]",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {isAuthenticated && user ? (
                <>
                  {adminUser && (
                    <Link
                      to="/admin/messages"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 min-h-[48px]",
                        location.pathname === "/admin/messages"
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Inbox className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                  )}
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {user.name}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 min-h-[48px] justify-start"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 min-h-[48px]",
                      location.pathname === "/login"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 min-h-[48px]",
                      location.pathname === "/signup"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Mobile Bottom Tab Bar */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-screen overflow-x-auto">
        {allNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 min-w-[60px] min-h-[60px]",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground active:text-foreground active:bg-accent"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] leading-tight text-center">{item.label}</span>
            </Link>
          )
        })}
        {isAuthenticated && user && (
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 min-w-[60px] min-h-[60px] text-muted-foreground active:text-foreground active:bg-accent"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] leading-tight text-center">Logout</span>
          </button>
        )}
      </div>
    </nav>
    </>
  )
})