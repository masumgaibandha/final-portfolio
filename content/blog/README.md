# Blog content

Articles are MDX files in this directory. The filename is the slug:

```
content/blog/cold-email-infrastructure.mdx  ->  /blog/cold-email-infrastructure
public/blog/cold-email-infrastructure/cover.webp
```

Images for a post live in `public/blog/<slug>/` and are referenced from the web
root (`/blog/<slug>/cover.webp`), never by a relative path.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Used as the `<h1>` and in the page title |
| `description` | yes | SEO description and the excerpt on the index |
| `publishedAt` | yes | `YYYY-MM-DD`; also the sort key |
| `updatedAt` | no | `YYYY-MM-DD` |
| `coverImage` | no | Web-root path, e.g. `/blog/<slug>/cover.webp` |
| `coverAlt` | only with `coverImage` | The build fails if a cover has no alt text |
| `tags` | no | Defaults to `[]` |
| `draft` | no | Defaults to `false` |

Frontmatter is validated by zod in `src/lib/blog.ts`. A bad date or a missing
description fails the build and names the offending file, rather than shipping
a post with broken metadata.

## Drafts

`draft: true` posts are visible with `npm run dev` and excluded from
`npm run build`, so a post can be previewed before it is reachable in
production. They are also left out of the sitemap and marked `noindex`.

Copy `example-article.mdx` to start. Don't publish placeholder articles — the
index shows a deliberate empty state when nothing is published.
