# Design QA — Miizu landing page

## Comparison target

- Source visual truth:
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-622ebaa9-5a7b-4268-8af4-ae597c712762.png` — hero, 3840 × 2160 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-027a78a7-b368-4288-a803-d3c262007b6c.png` — work, 3840 × 2160 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-c275e4ac-535b-4420-a9fe-a9196af12c51.png` — contact, 3840 × 2160 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-1dec03ae-90fa-43a2-8f4a-5c5b0afd5b7d.png` — footer, 3840 × 2160 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-9a61760f-5dfe-4e3f-90f3-53733c94df86.png` — clarified `NVA` footer composition, 2298 × 1378 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-7443380f-a8c9-4ef4-8b22-a4c200ade39f.jpg` — mobile footer issue capture, 1260 × 2800 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-d6cc5407-cdf8-4fab-a4c5-df0e50ad740c.jpg` — mobile outer-glyph alignment issue capture, 1260 × 2800 px.
  - `/Users/snupai/.t3/userdata/attachments/ff2c085d-db8a-425c-bac8-b8b011a923bc-798fb6dd-c1b1-4acb-b566-6e73f4ac2001.jpg` — mobile right-edge clipping issue capture, 1260 × 2800 px.
  - Supplied palette PDF: background `#fbfbfe`, ink `#050315`, primary `#2117e6`.
- Rendered implementation: `https://snupais-mac-mini.tail26dbaa.ts.net:3000/`.
- Browser-rendered screenshots:
  - `/tmp/miizu-qa/hero-desktop-v2.jpg` — 1079 × 675 px from a 1439 × 900 CSS viewport at 0.75 capture scale.
  - `/tmp/miizu-qa/work-desktop.jpg` — 935 × 585 px from a 1439 × 900 CSS viewport at 0.65 capture scale.
  - `/tmp/miizu-qa/contact-desktop.jpg` — 935 × 585 px from a 1439 × 900 CSS viewport at 0.65 capture scale.
  - `/tmp/miizu-qa/hero-mobile-v2.jpg` — 387 × 839 px from a 430 × 932 CSS viewport at 0.9 capture scale.
  - `/tmp/miizu-footer-viewport-fixed.jpg` — footer/contact state, 935 × 585 px from a 1439 × 900 CSS viewport at 0.65 capture scale.
  - `/tmp/miizu-qa/footer-mobile-tight.png` — revised mobile footer, 860 × 1864 px from a 430 × 932 CSS viewport at device scale 2.
- Density normalization: each 3840 × 2160 source was downsampled and letterboxed into the implementation capture frame before comparison. The source is 16:9 while the tested desktop viewport is approximately 16:10; letterbox space was excluded from fidelity findings.
- Mobile footer normalization: the 1260 px-wide user capture was scaled to 860 px to match the implementation screenshot width; browser chrome and the different vertical crop were excluded from footer-proportion findings.

## State

- Hero: post-preloader initial state.
- Work: final expanded showreel state, using the rendered final motion styles.
- Contact: initial empty form with one of the intentionally randomized approved headlines.
- Mobile: initial hero at 430 × 932 with the responsive showreel card.
- Footer: bottom-of-page state with contact actions above the full-width `NVA` wordmark.
- Mobile footer: final contact controls, edge-to-edge `NVA` strip, and legal-link stack at 430 × 932.

## Full-view comparison evidence

- `/tmp/miizu-qa/hero-comparison-v2.png` — source and revised implementation side by side, 2158 × 675 px.
- `/tmp/miizu-qa/work-comparison.png` — source and implementation side by side, 1872 × 586 px.
- `/tmp/miizu-qa/contact-comparison.png` — source and implementation side by side, 1872 × 586 px.
- `/tmp/miizu-footer-comparison-full.png` — clarified footer source and revised browser-rendered implementation side by side, 1870 × 585 px.
- `/tmp/miizu-qa/footer-mobile-comparison.png` — user mobile issue capture and revised implementation side by side, 1720 × 1912 px after width normalization.

## Focused comparison evidence

- `/tmp/miizu-qa/focus/hero-title-comparison-v2.png` — hero typography/handwritten overlay, 1600 × 504 px.
- `/tmp/miizu-qa/focus/contact-form-comparison.png` — form density, labels, controls, and submit action, 900 × 760 px.
- `/tmp/footer-comparison-v2.png` — focused `NVA` wordmark scale, clipping, split-color treatment, and link placement, 2144 × 378 px.
- The work title and gradient remained clearly legible in the full-view evidence, so no additional crop was required there.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: SF Pro Display is used local-first with Apple system fallbacks and Public Sans as the portable fallback. The handwritten `Hey` is intentionally interpreted with Caveat Brush because the source contains no reusable lettering asset. Hierarchy, weights, wrapping, and compact UI copy track the source.
- Spacing and layout rhythm: hero title/card proportions, full-screen work composition, 2:1 contact split, form density, the full-width footer wordmark, and mobile stacking preserve the source hierarchy. On mobile, the blue strip now begins and ends at the `NVA` line box with no surplus banner area. No horizontal overflow was found at 430 px.
- Colors and tokens: the PDF palette is mapped exactly to three local tokens. Active controls use the blue/ink/white brand system; the work gradient preserves the source's dark-to-blue balance.
- Image quality and asset fidelity: the source explicitly permits a raw simple showreel shape, so the flat responsive blue surface is intentional rather than a missing visual asset. The only added display asset is a local font file; the booking arrow uses the existing Lucide icon library.
- Copy and content: navigation, work copy, client names, contact prompts, randomized headline set, email, and footer labels follow the supplied boards. The displayed footer mark is the clarified `NVA`, while the hover note retains “Nuvia is literally my Brand” from the annotation. Form placeholder wording is polished from the wireframe while retaining its meaning.
- States and accessibility: semantic buttons/links/labels, native required-field validation, visible focus styles, reduced-motion handling, selected-region `aria-pressed`, and the centered commission-pause overlay were checked. Empty submit focuses the first invalid field.
- Responsive: desktop 1439 × 900 and mobile 430 × 932 were checked. The mobile title, handwritten overlay, navigation, showreel card, and edge-to-edge `NVA` footer do not overflow or collide.
- Runtime diagnostics: T3 Preview DOM inspection at 430 × 932 confirms the visible mobile layer has `clip-path: none`, no horizontal document overflow, and sampled glyph ink at exactly `0 → 419px` inside the 420px content width. The same edge geometry was verified with both SF Pro and the Android/Public Sans fallback. The Tailnet route returns HTTP 200 with valid TLS, and ESLint and TypeScript pass. A fresh post-fix screenshot remains unavailable because T3 Preview's snapshot action fails.

## Comparison history

1. Initial comparison found one P2 typography issue: the handwritten hero word was too large and sat too high on both desktop and mobile, changing the source hierarchy.
2. Fix: desktop sizing changed from `24vw` to `20vw`, mobile from `38vw` to `31vw`, and the vertical offsets were lowered.
3. Post-fix evidence: `/tmp/miizu-qa/hero-comparison-v2.png`, `/tmp/miizu-qa/focus/hero-title-comparison-v2.png`, and `/tmp/miizu-qa/hero-mobile-v2.jpg`. The overlay now stays within the title region and preserves navigation/card separation.
4. The user-supplied footer clarification exposed one P1 mismatch: the implementation spelled `NUVIA`, confined it to the blue column, and placed it too low; the reference uses the oversized `NVA` mark beginning at the footer edge and crossing the blue/white split.
5. Fix: the mark now spells `NVA`, uses two synchronized text layers clipped at the responsive column boundary, starts at the footer edge, and remains behind the legal links. The “represented by” annotation and hover note remain intact.
6. Post-fix evidence: `/tmp/miizu-footer-comparison-full.png` and `/tmp/footer-comparison-v2.png`. No actionable P0/P1/P2 footer differences remain.
7. The mobile issue capture exposed one P2 responsive mismatch: the `NVA` letters occupied only part of a fixed 22rem blue panel, leaving a large empty blue block below the wordmark.
8. Fix: the mobile mark now uses a 58vw type scale with zero left padding, while its clipped blue panel is exactly 41.76vw high (the mark's 0.72 line box) and hides any type overflow.
9. Post-fix evidence: `/tmp/miizu-qa/footer-mobile-tight.png` and `/tmp/miizu-qa/footer-mobile-comparison.png`. `NVA` spans the viewport and the white legal area begins immediately at the letter baseline; no actionable mobile-footer mismatch remains.
10. The subsequent Android capture exposed one P2 font-metric mismatch: the natural left side-bearing of `N` remained visible while the right edge of `A` overflowed the viewport.
11. Fix: the mobile wordmark now measures the actual ink bounds of `NVA` after the device font loads, then applies a matched horizontal scale and translation to both clipped word layers. This preserves SF Pro where installed and correctly fits the Public Sans fallback used on Android.
12. Post-fix geometry: SF Pro resolved from `14.13 → 445.12` to exactly `0 → 420px`; simulated Android Public Sans resolved from `20.15 → 462.33` to exactly `0 → 420px`, with zero document overflow. A final browser screenshot is pending because the T3 preview capture client stopped responding after the DOM verification.
13. The latest Android capture exposed a second P2 issue: despite the correct transform, the white word layer's `clip-path` still clipped the visible `A` at the transformed element box, leaving blue space at the right edge.
14. Fix: mobile removes that desktop-only split-color clipping mask. The fitter now samples actual rendered alpha pixels instead of trusting trailing-letter-spacing metrics and repeats after the settled layout frame.
15. Post-fix browser geometry: SF Pro and simulated Android/Public Sans both resolve their sampled visible ink to exactly `0 → 419px` in the 420px content width; the white layer reports `clip-path: none` and document width remains `420 → 420px`. T3 Preview's screenshot action still fails, so a new same-state raster comparison could not be produced.

## Primary interactions tested

- Local/International selector updates `aria-pressed` state.
- Empty Send Request uses native validation and focuses the name field without submitting.
- Booking and direct-email actions resolve to `mailto:` fallbacks when no booking URL is configured.
- Footer wordmark is keyboard-focusable for its Nuvia tooltip.
- Mobile `who is miizu?` link navigates to `#hero`, returns scroll position to 0, and leaves no horizontal overflow.
- Sticky scene remains pinned while scrolling; the showreel geometry has verified card and expanded states.

## Follow-up polish

- P3: replace the raw showreel surface with the final optimized video when supplied.
- P3: replace the font-based handwritten `Hey` if a final lettering asset is supplied.

final result: blocked
