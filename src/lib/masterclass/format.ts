const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBengaliDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

/**
 * The single place a BDT amount becomes a displayed Bengali price string —
 * replaces what used to be five hand-typed "৳২,০০০" copies across
 * Hero/Registration/StickyMobileCta/FinalCta/masterclass-content.ts. Always
 * pass a value from `resolvePriceBDT()` or an already-stored order amount,
 * never a re-typed literal.
 */
export function formatBDT(amountBDT: number): string {
  const grouped = amountBDT.toLocaleString("en-US");
  return `৳${toBengaliDigits(grouped)}`;
}
