// Test script for formatBDT currency utility
function formatBDT(amount, options = {}) {
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
  const formatted = Math.round(absVal).toLocaleString('en-BD');
  const symbol = includeSymbol ? '৳' : '';

  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

const tests = [
  { input: 0, expected: '৳0' },
  { input: 0, options: { showFreeForZero: true }, expected: 'Free' },
  { input: 1250, expected: '৳1,250' },
  { input: 12500, expected: '৳12,500' },
  { input: 125000, expected: '৳125,000' },
  { input: 1850000, expected: '৳1,850,000' },
  { input: -1850, expected: '-৳1,850' },
  { input: '3500.75', expected: '৳3,501' },
  { input: null, expected: '৳0' },
  { input: undefined, expected: '৳0' },
  { input: 5000, options: { includeSymbol: false }, expected: '5,000' },
];

let failed = 0;
for (const t of tests) {
  const res = formatBDT(t.input, t.options);
  if (res !== t.expected) {
    console.error(`[FAIL] Input: ${t.input}, Expected: "${t.expected}", Got: "${res}"`);
    failed++;
  } else {
    console.log(`[PASS] Input: ${t.input} -> "${res}"`);
  }
}

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All currency formatter tests passed successfully.');
}
