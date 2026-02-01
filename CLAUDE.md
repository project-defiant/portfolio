# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog website for Szymon Szyszkowski. Built with Next.js 16, React 18, and TypeScript. Uses Tailwind CSS for styling with a dark theme.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## Architecture

### Page Routes (`pages/`)
- `index.tsx` - Home page with hero section
- `aboutme.tsx` - About Me page
- `timeline.tsx` - Professional timeline with skill icons
- `blog/index.tsx` - Blog listing with tag filtering
- `blog/[postId].tsx` - Dynamic blog post viewer

### Component Organization (`components/`)
- `layout/` - Layout wrapper, main header with hamburger menu, background
- `hero/` - Hero section for home page
- `postcard/` - Blog post card component
- `text-components/` - Text animation wrapper
- `logo/` and `footer/` - Site-wide components

### Blog System
Blog posts are fetched from an external GitHub repository (Project-Defiant/Project-defiant) via Octokit. Posts are indexed in `index.json` with metadata (title, description, date, tags). The `scripts/get_post.ts` handles GitHub API integration.

**Requires:** `PORTFOLIO_TOKEN` in `.env.local`

## Styling

### Color Theme (tailwind.config.js)
- `background`: #060213 (dark navy)
- `lightblue`: #46B9EB
- `magenta`: #B3365B
- `font`: #EBCACA (light tan text)

### Breakpoints
- sm: 480px, md: 768px, lg: 976px, xl: 1440px

### Font
Alef (Google Font, weights 400 and 700)

## Code Style

- Double quotes required
- Semicolons required
- Unix line endings (LF)
- Tab indentation (width: 4)
- TypeScript strict mode is disabled
