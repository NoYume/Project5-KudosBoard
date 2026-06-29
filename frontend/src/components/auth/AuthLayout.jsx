// Curated images for the decorative panel (reused from the board seed set).
const PANEL_IMAGES = [
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1740&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1740&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1740&auto=format&fit=crop',
]

// Split-screen auth shell: centered form on the left, full-bleed image
// collage on the right (hidden on small screens). Inspired by COSMOS, but
// styled with the site's own tokens and Kudos Board branding.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      {/* Form column */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Decorative image column */}
      <div className="hidden flex-col items-center justify-center gap-4 bg-muted/40 p-10 lg:flex">
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <img
            src={PANEL_IMAGES[0]}
            alt=""
            className="mx-auto h-40 w-3/4 rounded-xl object-cover shadow-sm"
          />
          <img
            src={PANEL_IMAGES[1]}
            alt=""
            className="h-72 w-full rounded-xl object-cover shadow-md"
          />
          <img
            src={PANEL_IMAGES[2]}
            alt=""
            className="mx-auto h-40 w-2/3 rounded-xl object-cover shadow-sm"
          />
        </div>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Boards full of praise, encouragement, and appreciation.
        </p>
      </div>
    </div>
  )
}
