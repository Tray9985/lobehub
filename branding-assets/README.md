# Branding Assets Workspace

This directory is the single source of truth for replaceable brand assets.

Use subdirectories by asset type so future updates (icons, logos, social images,
desktop assets) do not get mixed together.

## Current Structure

- `icons/`: browser favicon, PWA icon, and app icon source files

You can add more folders later, for example:

- `logos/`
- `social/`
- `desktop/`

## Workflow

1. Put your latest source files into the relevant `source/` folder.
2. Export target formats/sizes based on each folder's README.
3. Replace project target files.
4. Run validation checklist before commit.

See `branding-assets/icons/README.md` for the current icon replacement checklist.
