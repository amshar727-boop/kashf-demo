import fs from 'node:fs';

const html = fs.readFileSync('legacy-finance.html', 'utf8');

const required = [
  'نسبة الربح الثابتة المكافئة',
  'إجمالي الربح التقريبي',
  'function flatRate(P,total,n)',
  'o.fixedRate.toFixed(2)',
  'يعرض كشف جميع الخيارات كنسب ربح ثابتة مكافئة'
];

const missing = required.filter(needle => !html.includes(needle));
if (missing.length) {
  console.error('Missing fixed-rate implementation:', missing.join(', '));
  process.exit(1);
}

function payment(principal, annualRate, months) {
  const monthlyRate = annualRate / 1200;
  const factor = (1 + monthlyRate) ** months;
  return principal * monthlyRate * factor / (factor - 1);
}

function flatRate(principal, total, months) {
  return (total - principal) / principal / (months / 12) * 100;
}

const principal = 1_305_000;
const months = 120;
const monthlyPayment = payment(principal, 3.95, months);
const total = monthlyPayment * months;
const fixedRate = flatRate(principal, total, months);

if (Math.round(monthlyPayment) !== 13_182) {
  throw new Error(`Unexpected monthly payment: ${monthlyPayment}`);
}
if (Math.round(total) !== 1_581_780) {
  throw new Error(`Unexpected total repayment: ${total}`);
}
if (fixedRate.toFixed(2) !== '2.12') {
  throw new Error(`Unexpected fixed rate: ${fixedRate}`);
}

console.log('Finance fixed-rate checks passed:', {
  monthlyPayment: Math.round(monthlyPayment),
  total: Math.round(total),
  fixedRate: fixedRate.toFixed(2) + '%'
});
