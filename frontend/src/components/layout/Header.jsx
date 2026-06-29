import { Link, useNavigate } from 'react-router-dom'
import { LogOut, PartyPopper, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { useUser } from '@/context/UserContext'

export default function Header() {
  const { isLoggedIn, user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <PartyPopper className="size-6 text-primary" />
          <span className="text-lg tracking-tight">Kudos Board</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Welcome, <span className="font-medium text-foreground">{user.username}</span>
              </span>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="sm" className="gap-2">
                <Link to="/signup">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
