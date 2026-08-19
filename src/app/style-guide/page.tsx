export const metadata = {
  title: "Style Guide",
};

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen w-full bg-white text-ink">
      <div className="mx-auto max-w-6xl px-6 py-32">
        <h1 className="mb-2 text-4xl font-extrabold">Style Guide</h1>
        <p className="mb-10 text-ink/70">
          Reference for colors, tokens, and common UI patterns.
        </p>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Colors</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-brand" />
              <div className="p-4">
                <div className="font-semibold">brand</div>
                <div className="text-sm text-ink/70">#0189ff</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-brand px-2 py-0.5 text-xs text-white">
                    bg-brand
                  </span>
                  <span className="rounded border border-brand px-2 py-0.5 text-xs text-brand">
                    text-brand
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-brand-dark" />
              <div className="p-4">
                <div className="font-semibold">brand-dark</div>
                <div className="text-sm text-ink/70">#006fd1</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-brand-dark px-2 py-0.5 text-xs text-white">
                    bg-brand-dark
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-brand-light" />
              <div className="p-4">
                <div className="font-semibold">brand-light</div>
                <div className="text-sm text-ink/70">#e6f3ff</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-brand-light px-2 py-0.5 text-xs text-ink">
                    bg-brand-light
                  </span>
                </div>
              </div>
            </div>
            {/* Ink */}
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-ink" />
              <div className="p-4">
                <div className="font-semibold text-ink">ink</div>
                <div className="text-sm text-ink/70">#0b0c0f</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-ink px-2 py-0.5 text-xs text-white">
                    bg-ink
                  </span>
                  <span className="rounded border border-ink px-2 py-0.5 text-xs text-ink">
                    text-ink
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-ink/70" />
              <div className="p-4">
                <div className="font-semibold">ink-muted</div>
                <div className="text-sm text-ink/70">#6b7280</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded border border-black/10 px-2 py-0.5 text-xs text-ink/70">
                    text-ink/70
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="h-20 bg-white" />
              <div className="p-4">
                <div className="font-semibold">surface</div>
                <div className="text-sm text-ink/70">#ffffff</div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded border bg-white px-2 py-0.5 text-xs">
                    bg-white
                  </span>
                  <span className="rounded bg-black/5 px-2 py-0.5 text-xs">
                    border-black/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-brand px-5 py-2 text-white transition-colors hover:bg-brand-dark">
              Primary
            </button>
            <button className="rounded-full border border-brand bg-white px-5 py-2 text-brand transition-colors hover:bg-brand-light">
              Outline
            </button>
            <button className="rounded-full bg-brand/10 px-5 py-2 text-brand transition-colors hover:bg-brand/20">
              Tint
            </button>
          </div>
        </section>

        {/* Links */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Links</h2>
          <div className="space-x-6">
            <a className="text-brand underline hover:text-brand-dark" href="#">
              Inline link
            </a>
            <a
              className="text-ink decoration-brand/40 underline-offset-4 hover:text-brand hover:decoration-brand"
              href="#"
            >
              With underline accent
            </a>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Inputs</h2>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <input
              placeholder="Text"
              className="rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <select className="rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40">
              <option>Option A</option>
              <option>Option B</option>
            </select>
            <textarea
              placeholder="Message"
              className="rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:col-span-2"
            />
          </div>
        </section>

        {/* Usage notes */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold">Usage</h2>
          <ul className="list-disc space-y-1 pl-6 text-ink/80">
            <li>
              <code>bg-white</code> surfaces with <code>text-ink</code>.
            </li>
            <li>
              <code>brand</code> for primary actions, links, focus rings.
            </li>
            <li>
              <code>brand-dark</code> for hover/active states.
            </li>
            <li>
              <code>brand-light</code> for subtle backgrounds and chips.
            </li>
            <li>
              Borders use <code>border-black/5</code> to <code>/10</code> on
              white.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
