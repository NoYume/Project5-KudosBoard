import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Visual-only auth shell. Real login/signup requires the backend (Milestone 2+),
// so submitting does nothing yet — this provides the UI surface for the
// User Accounts stretch feature.
export default function AuthModal({ open, onOpenChange }) {
  const noop = (e) => e.preventDefault()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Kudos Board</DialogTitle>
          <DialogDescription>
            Accounts arrive with the backend — this is a preview of the sign-in
            experience.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form className="space-y-4 pt-2" onSubmit={noop}>
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input id="login-username" placeholder="yourname" autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled>
                Log In (coming soon)
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4 pt-2" onSubmit={noop}>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input id="signup-username" placeholder="yourname" autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled>
                Sign Up (coming soon)
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
