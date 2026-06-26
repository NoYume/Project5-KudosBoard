import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GiphySearch from '@/components/cards/GiphySearch'

const EMPTY = { message: '', gifUrl: '', author: '' }

export default function CreateCardModal({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.message.trim()) next.message = 'A message is required.'
    if (!form.gifUrl) next.gifUrl = 'Please search and select a gif.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onCreate({
      message: form.message.trim(),
      gifUrl: form.gifUrl,
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Card</DialogTitle>
          <DialogDescription>
            Write a kudos message and pick a gif to go with it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="card-message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="card-message"
              value={form.message}
              onChange={(e) => {
                setForm((p) => ({ ...p, message: e.target.value }))
                setErrors((p) => ({ ...p, message: undefined }))
              }}
              placeholder="Say something kind..."
              rows={3}
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Gif <span className="text-destructive">*</span>
            </Label>
            <GiphySearch
              selectedGif={form.gifUrl}
              onSelect={(url) => {
                setForm((p) => ({ ...p, gifUrl: url }))
                setErrors((p) => ({ ...p, gifUrl: undefined }))
              }}
            />
            {errors.gifUrl && <p className="text-sm text-destructive">{errors.gifUrl}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-author">Author (optional)</Label>
            <Input
              id="card-author"
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              placeholder="Your name"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
