import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CATEGORIES } from '@/data/categories'

const EMPTY = { title: '', category: '', imageUrl: '', author: '' }

export default function CreateBoardModal({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.category) next.category = 'Category is required.'
    if (!form.imageUrl.trim()) next.imageUrl = 'Image URL is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onCreate({
      title: form.title.trim(),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      author: form.author,
    })
    handleClose(false)
  }

  const handleClose = (next) => {
    if (!next) {
      setForm(EMPTY)
      setErrors({})
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Board</DialogTitle>
          <DialogDescription>
            Give your kudos board a title, pick a category, and add a cover image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="board-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="board-title"
              value={form.title}
              onChange={(e) => setField('title')(e.target.value)}
              placeholder="e.g. Team Wins This Quarter"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={form.category} onValueChange={setField('category')}>
              <SelectTrigger id="board-category" className="w-full" aria-invalid={!!errors.category}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-image">
              Image URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="board-image"
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl')(e.target.value)}
              placeholder="https://..."
              aria-invalid={!!errors.imageUrl}
            />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-author">Author (optional)</Label>
            <Input
              id="board-author"
              value={form.author}
              onChange={(e) => setField('author')(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
