import Script from "next/script";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq?: unknown;
  }
}

interface MetaPixelProps {
  pixelId: string;
  contentName: string;
  currency: string;
  value: number;
}

/**
 * Server Component — the Facebook bootstrap snippet defines `fbq`
 * synchronously and queues calls until `fbevents.js` finishes loading, so
 * `init`/`PageView`/`ViewContent` can all be issued in the same inline
 * script with no client-side effect or load race to manage. `next/script`
 * dedupes by `id`, so this only ever executes once per page load even if a
 * parent re-renders. Only ever rendered when `NEXT_PUBLIC_META_PIXEL_ID` is
 * set (checked by the caller — see `page.tsx`) and `pixelId` is re-checked
 * here as a second guard.
 *
 * `InitiateCheckout` and the Purchase event are NOT fired from this
 * component — see `MasterclassRegistrationForm.tsx` (`InitiateCheckout`,
 * client-side, at genuine registration start) and
 * `src/lib/masterclass/meta-capi.ts` (`Purchase`, server-side only, fired at
 * `REVIEW → PAID` — see that file's doc comment for why there is
 * deliberately no browser Purchase call anywhere in this codebase).
 */
export function MetaPixel({ pixelId, contentName, currency, value }: MetaPixelProps) {
  if (!pixelId) return null;

  /* contentName/currency come from our own copy/constants, never user input; value is a number — safe to interpolate directly. */
  const viewContentPayload = JSON.stringify({
    content_name: contentName,
    content_type: "product",
    currency,
    value,
  });

  return (
    <Script
      id="meta-pixel-base"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');
fbq('track', 'ViewContent', ${viewContentPayload});
`,
      }}
    />
  );
}
