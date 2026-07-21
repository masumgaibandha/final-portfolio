"use client";

import { Button } from "@heroui/react/button";
import { Modal } from "@heroui/react/modal";
import { useEffect, useId, useRef, useState } from "react";
import { LuX } from "react-icons/lu";

import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * A testimonial clamped to three lines, with the full text in a dialog.
 *
 * Whether "Read more" appears is measured, not guessed from a character count:
 * the same quote clamps at 360px and does not at 1440px, so the only honest
 * test is whether this element actually overflows its own clamp.
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const headingId = useId();

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const measure = () => {
      /* 1px of slack absorbs sub-pixel rounding in the line box. */
      setIsClamped(el.scrollHeight - el.clientHeight > 1);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="border-hairline bg-surface card-static flex h-full flex-col border p-7">
      <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
        <span className="sr-only">Reviewed on </span>
        {testimonial.source}
      </p>

      {/*
       * `min-h` reserves three lines even for short quotes, so every quote area
       * is the same height whether or not it clamps.
       */}
      <blockquote
        ref={quoteRef}
        className="text-ink mt-4 line-clamp-3 min-h-[calc(3*1.625em)] leading-relaxed break-words"
      >
        <p>“{testimonial.quote}”</p>
      </blockquote>

      {/*
       * The slot is always rendered so the button's presence or absence cannot
       * change a card's height — only its contents change.
       */}
      <div className="mt-3 min-h-9">
        {isClamped ? (
          <Modal>
            <Button
              variant="ghost"
              className="text-action hover:text-action-hover focus-visible:outline-action -ml-1 h-9 rounded-full px-1 text-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Read more
              <span className="sr-only">
                {" "}
                of this {testimonial.source} review from{" "}
                {testimonial.attribution}
              </span>
            </Button>

            <Modal.Backdrop className="bg-ink/50 fixed inset-0 z-100 flex items-center justify-center p-4">
              <Modal.Container
                size="md"
                className="border-hairline bg-surface w-full max-w-xl border shadow-xl"
              >
                <Modal.Dialog aria-labelledby={headingId} className="p-7 md:p-9">
                  <Modal.Header className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                        <span className="sr-only">Reviewed on </span>
                        {testimonial.source}
                      </p>
                      <Modal.Heading
                        id={headingId}
                        className="font-heading text-ink mt-3 text-xl tracking-tight md:text-2xl"
                      >
                        {testimonial.attribution}
                      </Modal.Heading>
                      <p className="text-ink-muted mt-1 text-sm">
                        {testimonial.context}
                      </p>
                    </div>

                    <Modal.CloseTrigger
                      aria-label="Close review"
                      className="border-hairline text-ink hover:border-action hover:text-action focus-visible:outline-action flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <LuX className="size-4" aria-hidden="true" />
                    </Modal.CloseTrigger>
                  </Modal.Header>

                  <Modal.Body className="mt-6">
                    <blockquote className="text-ink leading-relaxed break-words">
                      <p>“{testimonial.quote}”</p>
                    </blockquote>
                  </Modal.Body>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        ) : null}
      </div>

      <figcaption className="border-hairline mt-auto border-t pt-5">
        <span className="text-ink block text-sm font-medium">
          {testimonial.attribution}
        </span>
        <span className="text-ink-muted mt-1 block text-sm break-words">
          {testimonial.context}
        </span>
      </figcaption>
    </figure>
  );
}
