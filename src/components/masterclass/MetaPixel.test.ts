import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { MetaPixel } from "@/components/masterclass/MetaPixel";

/*
 * No `@testing-library/react` in this project — MetaPixel has no hooks or
 * client interactivity (it just returns a <Script> with an inline snippet),
 * so calling it as a plain function and inspecting the returned element's
 * props is enough to verify which Meta events it emits and with what data,
 * without needing a DOM.
 */
describe("MetaPixel", () => {
  it("renders nothing when no pixel ID is configured", () => {
    const element = MetaPixel({ pixelId: "", contentName: "Masterclass", currency: "BDT", value: 1499 });
    expect(element).toBeNull();
  });

  it("emits PageView and ViewContent with content_name/currency/value, and never a Purchase event", () => {
    const element = MetaPixel({ pixelId: "1234567890", contentName: "Lead Gen Masterclass", currency: "BDT", value: 1499 });
    const html = (element as ReactElement<{ dangerouslySetInnerHTML: { __html: string } }>).props
      .dangerouslySetInnerHTML.__html;

    expect(html).toContain("fbq('init', \"1234567890\")");
    expect(html).toContain("fbq('track', 'PageView')");
    expect(html).toContain("fbq('track', 'ViewContent'");
    expect(html).toContain('"content_name":"Lead Gen Masterclass"');
    expect(html).toContain('"content_type":"product"');
    expect(html).toContain('"currency":"BDT"');
    expect(html).toContain('"value":1499');

    /* Purchase is CAPI-only in this project — see meta-capi.ts. The browser snippet must never mention it. */
    expect(html).not.toContain("Purchase");
    expect(html).not.toContain("InitiateCheckout");

    /*
     * PageView and ViewContent must stay standard Meta events (`fbq('track', ...)`),
     * never `fbq('trackCustom', ...)` — a custom-event call would still "work"
     * (Meta would still receive it) but Meta's Events Manager would then
     * correctly classify it as a Custom Event rather than the standard one,
     * which is exactly the regression this guards against.
     */
    expect(html).not.toContain("trackCustom");
  });
});
