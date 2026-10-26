/**
 * BD Solar Energy - Centralized Bangladeshi Currency (BDT) Formatter
 * 
 * Rules:
 * 1. Always uses the genuine Unicode text character: ৳ (\u09F3).
 * 2. Never uses dollar signs, SVG icons, or fake approximations.
 * 3. Applies standard comma digit grouping (en-BD / standard e-commerce).
 * 4. Safely handles integers, decimals, negative amounts, null, undefined, and numeric strings.
 */

export interface FormatBDTOptions {
  /** If true and amount is 0, outputs 'Free' instead of '৳0' */
  showFreeForZero?: boolean;
  /** If false, omits the ৳ prefix */
  includeSymbol?: boolean;
}

export function formatBDT(
  amount: number | string | null | undefined,
  options: FormatBDTOptions = {}
): string {
  const { showFreeForZero = false, includeSymbol = true } = options;

  if (amount === null || amount === undefined || amount === '') {
    return includeSymbol ? '৳0' : '0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    return includeSymbol ? '৳0' : '0';
  }

  if (num === 0 && showFreeForZero) {
    return 'Free';
  }

  const isNegative = num < 0;
  const absVal = Math.abs(num);
  // Standard whole taka rounding with locale digit grouping
  const formatted = Math.round(absVal).toLocaleString('en-BD');
  const symbol = includeSymbol ? '৳' : '';

  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}
