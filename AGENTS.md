<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Niche landing pages (e.g. /painting-contractors, /home-renovation) render the shared `NichePage` component from a typed config in `src/lib/niches.ts`; add a niche by adding one config entry plus a thin route file. Why: layout/offer/flow must stay identical across niches.
- Niche-page applications use the embedded GoHighLevel form (`GhlForm`), never a custom form/webhook; attribution (UTMs, fbclid, fbp/fbc, niche, page_slug) is appended to the iframe src via `src/lib/attribution.ts`. Why: GHL hidden fields fill from query params.
- All Meta events go through `trackEvent` in `src/components/Layout.tsx` (Pixel + CAPI with shared event_id); never init the Pixel elsewhere. Why: dedup and single init.
- Tests use vitest (`bunx vitest run`), colocated as `*.test.ts`.
