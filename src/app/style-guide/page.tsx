export const metadata = {
  title: "Style Guide",
};

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen w-full bg-white text-ink">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Style Guide</h1>
        <p className="text-ink/70 mb-10">Reference for colors, tokens, and common UI patterns.</p>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Brand */}
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-brand" />
              <div className="p-4">
                <div className="font-semibold">brand</div>
                <div className="text-sm text-ink/70">#0189ff</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand text-white text-xs">bg-brand</span>
                  <span className="px-2 py-0.5 rounded border border-brand text-brand text-xs">text-brand</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-brand-dark" />
              <div className="p-4">
                <div className="font-semibold">brand-dark</div>
                <div className="text-sm text-ink/70">#006fd1</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-dark text-white text-xs">bg-brand-dark</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-brand-light" />
              <div className="p-4">
                <div className="font-semibold">brand-light</div>
                <div className="text-sm text-ink/70">#e6f3ff</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-light text-ink text-xs">bg-brand-light</span>
                </div>
              </div>
            </div>
            {/* Ink */}
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-ink" />
              <div className="p-4">
                <div className="font-semibold text-ink">ink</div>
                <div className="text-sm text-ink/70">#0b0c0f</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-ink text-white text-xs">bg-ink</span>
                  <span className="px-2 py-0.5 rounded border border-ink text-ink text-xs">text-ink</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-ink/70" />
              <div className="p-4">
                <div className="font-semibold">ink-muted</div>
                <div className="text-sm text-ink/70">#6b7280</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded text-xs text-ink/70 border border-black/10">text-ink/70</span>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-20 bg-white" />
              <div className="p-4">
                <div className="font-semibold">surface</div>
                <div className="text-sm text-ink/70">#ffffff</div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-white border text-xs">bg-white</span>
                  <span className="px-2 py-0.5 rounded bg-black/5 text-xs">border-black/5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-5 py-2 rounded-full bg-brand hover:bg-brand-dark text-white transition-colors">Primary</button>
            <button className="px-5 py-2 rounded-full bg-white text-brand border border-brand hover:bg-brand-light transition-colors">Outline</button>
            <button className="px-5 py-2 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition-colors">Tint</button>
          </div>
        </section>

        {/* Links */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <div className="space-x-6">
            <a className="text-brand hover:text-brand-dark underline" href="#">Inline link</a>
            <a className="text-ink hover:text-brand underline-offset-4 decoration-brand/40 hover:decoration-brand" href="#">With underline accent</a>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Inputs</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <input placeholder="Text" className="px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-brand/40" />
            <select className="px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-brand/40">
              <option>Option A</option>
              <option>Option B</option>
            </select>
            <textarea placeholder="Message" className="px-3 py-2 rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:col-span-2" />
          </div>
        </section>

        {/* Usage notes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Usage</h2>
          <ul className="list-disc pl-6 space-y-1 text-ink/80">
            <li><code>bg-white</code> surfaces with <code>text-ink</code>.</li>
            <li><code>brand</code> for primary actions, links, focus rings.</li>
            <li><code>brand-dark</code> for hover/active states.</li>
            <li><code>brand-light</code> for subtle backgrounds and chips.</li>
            <li>Borders use <code>border-black/5</code> to <code>/10</code> on white.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
