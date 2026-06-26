import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PartyPopper, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/theme/ThemeToggle'
import AuthModal from '@/components/auth/AuthModal'

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <PartyPopper className="size-6 text-primary" />
          <span className="text-lg tracking-tight">Kudos Board</span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setAuthOpen(true)}
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Log In</span>
          </Button>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
