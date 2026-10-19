# Music Videos — 19 October 2026

Based on remote main commit 2d3cb7d, including the latest Supabase project catalog and full CRUD editor. Add KYA PATA, STITCH ME RIGHT, NOT IN THE ROOM and ROOMFUL to the reel and a two-column homepage showcase, stacking on mobile. Preserve the existing serif typography, orange accent and dark surfaces.

## Content and persistence

Niddhish owns its Supabase projects catalog. The homepage and full reel share the same loader using the current project, thumbnail-override and URL-override endpoints. Existing overrides retain their priority. Inactive projects and the known YouTube placeholder are excluded; errors and empty collections never load Railway or demo projects. Reading the collection never writes or reseeds data.

Two existing music records (STITCH ME RIGHT and ROOMFUL) are reclassified, preserving their existing titles, URLs and thumbnails. KYA PATA and NOT IN THE ROOM are added once through the current project API. These are database edits, not startup seeds or hardcoded frontend records.

Manage these films at /admin/projects: choose Music Video, keep Active enabled, and use Display order to sort. The homepage music showcase displays the first four active music videos. Featured controls the separate selected-films section (up to twelve); it no longer fills empty slots with unselected projects. Existing separate thumbnail overrides remain available in the thumbnail editor.

/work?category=Music+Videos shows the entire music collection. Filters survive reload and browser history. Vimeo unlisted-link hashes are preserved; video IDs are never substituted for thumbnail image IDs.

## Verification

Run npm run test:projects for empty/error handling, category aliases, saved media, existing overrides, active status, ordering and the four Vimeo identities. Run npm run build for production compilation and type checks. Browser checks cover four music cards and players, the category link and reload, cross-page Music Videos navigation and a narrow viewport.
