import { Link, useLocation } from "react-router-dom"
import { memo, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Home, User, Briefcase, Mail, UserPlus, LogOut, LogIn, Inbox } from "lucide-react"
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

  const adminUser = useMemo(() => isAdminUser(user), [user])
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => !(item.hideForAdmin && adminUser))
  }, [adminUser])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 bg-clip-text text-transparent shrink-0">
            RoninDezigns
          </Link>
          
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full pr-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
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
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      location.pathname === "/admin/messages"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Inbox className="w-4 h-4" />
                    <span className="hidden md:inline">Messages</span>
                  </Link>
                )}
                <span className="hidden md:inline text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === "/login"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Login</span>
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === "/signup"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
})