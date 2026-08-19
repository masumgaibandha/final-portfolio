import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";

/**
 * `AnnouncementBar` is a Client Component (`useState`), so — unlike
 * `MetaPixel` — it can't be called as a bare function and have its return
 * value inspected directly; hooks need an actual render pass.
 * `renderToStaticMarkup` gives one without needing jsdom or
 * `@testing-library/react` (neither is a dependency of this project).
 *
 * This guards a real regression from development: the flex row was briefly
 * shipped without `flex-wrap` even though its `gap-y-1` already implied a
 * second line was expected — on a narrow phone that forces the row to a
 * single unbreakable line instead of letting the CTA drop below the text,
 * which is exactly the kind of horizontal-overflow bug `tsc`/lint/build
 * cannot catch (only real layout measurement can), so it's pinned here.
 */
describe("AnnouncementBar", () => {
  it("keeps the announcement row wrap-capable so the CTA can drop to its own line on narrow phones", () => {
    const html = renderToStaticMarkup(createElement(AnnouncementBar));

    const rowClassMatch = html.match(/class="([^"]*justify-center[^"]*)"/);
    expect(rowClassMatch).not.toBeNull();
    expect(rowClassMatch![1].split(" ")).toContain("flex-wrap");
  });
});
