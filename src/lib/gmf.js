import { GMF_RATE } from '../data/tax.js'

// Redondea a centavos para evitar ruido de coma flotante
export const toCents = (value) => Math.round(value * 100) / 100

// Parte gravada de un movimiento después del tope exento del mes
export function taxableAmount(amount, exemptCap = 0) {
  return Math.max(0, amount - exemptCap)
}

// GMF de un movimiento (o del total del mes si hay tope exento)
export function gmf(amount, exemptCap = 0) {
  return toCents(taxableAmount(amount, exemptCap) * GMF_RATE)
}

// Lo que sale de la cuenta: el movimiento más su GMF
export function totalDebit(amount, exemptCap = 0) {
  return toCents(amount + gmf(amount, exemptCap))
}

// Inverso de totalDebit: máximo que se puede enviar con un saldo dado
export function maxTransfer(balance, exemptCap = 0) {
  if (balance <= exemptCap) return toCents(balance)
  return toCents((balance + exemptCap * GMF_RATE) / (1 + GMF_RATE))
}

// Costo anual de repetir el mismo movimiento cada mes (el tope se aplica mes a mes)
export function yearlyGmf(monthlyAmount, exemptCap = 0) {
  return toCents(gmf(monthlyAmount, exemptCap) * 12)
}
