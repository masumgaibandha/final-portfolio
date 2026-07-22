import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";

/**
 * Maps MDX output onto the site's design system, so article bodies inherit the
 * same type, colour and link treatment as the rest of the site instead of
 * falling back to unstyled browser defaults.
 */
export const mdxComponents: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="font-heading text-ink mt-14 scroll-mt-28 text-2xl tracking-tight md:text-3xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="font-heading text-ink mt-10 scroll-mt-28 text-xl tracking-tight md:text-2xl"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="font-body text-ink mt-8 scroll-mt-28 font-semibold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-ink-muted mt-5 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-5 space-y-2.5" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-ink-muted leading-relaxed" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-action text-ink mt-8 border-l-2 pl-5 leading-relaxed italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-hairline mt-12 border-t" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-ink font-semibold" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="border-hairline bg-canvas-alt text-ink rounded border px-1.5 py-0.5 text-[0.85em]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    /* Scrolls inside itself so a long line never widens the page. */
    <pre
      className="border-hairline bg-canvas-alt focus-visible:outline-action mt-8 overflow-x-auto border p-5 text-sm leading-relaxed focus-visible:outline-2"
      tabIndex={0}
      {...props}
    />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const isExternal = /^https?:\/\//.test(href);
    const className =
      "text-ink hover:text-action decoration-action focus-visible:outline-action rounded-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...props}
        />
      );
    }

    return <Link href={href} className={className} {...props} />;
  },
  /*
   * Markdown images go through next/image so article art is optimised like the
   * rest of the site. Width/height are required, so a sensible default is used
   * and the intrinsic size is corrected by `object-contain` within the frame.
   */
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") return null;

    return (
      <figure className="mt-10">
        <div className="border-hairline bg-canvas-alt overflow-hidden border">
          <Image
            src={src}
            alt={alt ?? ""}
            width={1200}
            height={800}
            sizes="(min-width: 768px) 720px, 100vw"
            className="h-auto w-full"
          />
        </div>
        {alt ? (
          <figcaption className="text-ink-muted mt-3 text-sm">{alt}</figcaption>
        ) : null}
      </figure>
    );
  },
};
