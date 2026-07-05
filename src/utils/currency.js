export const USD_TO_INR_RATE = 95.21

export function usdToInr(amountInUsd) {
  return amountInUsd * USD_TO_INR_RATE
}

export function formatInr(amountInUsd, options = {}) {
  const inrValue = usdToInr(amountInUsd)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...options,
  }).format(inrValue)
}
