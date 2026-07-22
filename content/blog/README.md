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
| `coverImage` | **yes to publish** | Web-root path, e.g. `/blog/<slug>/cover.webp` |
| `coverAlt` | **yes to publish** | Meaningful description of the image |
| `tags` | no | Defaults to `[]` |
| `draft` | no | Defaults to `false` |

Frontmatter is validated by zod in `src/lib/blog.ts`. A bad date or a missing
description fails the build and names the offending file, rather than shipping
a post with broken metadata.

## Every published article needs a cover

**A post cannot go out with `draft: false` unless it has both `coverImage` and
`coverAlt`.** The build fails, naming the file and both missing fields.

There is no fallback artwork, deliberately: the cover is the card image on
`/blog` and the social preview for the article, and a generated placeholder
would misrepresent the piece.

`coverAlt` must actually describe the image — it is read aloud by screen
readers and shown if the image fails to load. "Cover image" is not a
description; "A Postmark dashboard showing a 12% bounce rate before DNS
changes" is.

A **draft** may omit both, so you can write before the art exists. If a draft
does carry a `coverImage`, it still needs `coverAlt`.

Covers are rendered in a 16:9 media area with `object-cover`, so supply
something that survives being cropped to that ratio — roughly 1200×675 works
well, and anything wider than 4:3 crops top and bottom.

## Drafts

`draft: true` posts are visible with `npm run dev` and excluded from
`npm run build`, so a post can be previewed before it is reachable in
production. They are also left out of the sitemap and marked `noindex`.

Copy `example-article.mdx` to start. Don't publish placeholder articles — the
index shows a deliberate empty state when nothing is published.
