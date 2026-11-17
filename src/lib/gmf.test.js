import { describe, it, expect } from 'vitest'
import { gmf, totalDebit, maxTransfer, yearlyGmf } from './gmf.js'
import { parseCOP, formatCOP } from './format.js'
import { EXEMPT_CAP, LOW_AMOUNT_CAP } from '../data/tax.js'

describe('gmf', () => {
  it('cobra 4 por mil', () => {
    expect(gmf(1_000_000)).toBe(4000)
    expect(gmf(100_000)).toBe(400)
  })

  it('descuenta el tope exento de 350 UVT', () => {
    expect(EXEMPT_CAP).toBe(18_330_900)
    expect(gmf(20_000_000, EXEMPT_CAP)).toBeCloseTo(6676.4, 2)
    expect(gmf(10_000_000, EXEMPT_CAP)).toBe(0)
  })

  it('tope de bajo monto de 65 UVT', () => {
    expect(LOW_AMOUNT_CAP).toBe(3_404_310)
    expect(gmf(5_000_000, LOW_AMOUNT_CAP)).toBeCloseTo(6382.76, 2)
  })
})

describe('inverso', () => {
  it('para que lleguen 1.000.000 se necesitan 1.004.000', () => {
    expect(totalDebit(1_000_000)).toBe(1_004_000)
    expect(maxTransfer(1_004_000)).toBe(1_000_000)
  })

  it('ida y vuelta con la exención por encima del tope', () => {
    const debit = totalDebit(20_000_000, EXEMPT_CAP)
    expect(debit).toBeCloseTo(20_006_676.4, 2)
    expect(maxTransfer(debit, EXEMPT_CAP)).toBeCloseTo(20_000_000, 2)
  })

  it('bajo el tope exento no hay descuento', () => {
    expect(maxTransfer(5_000_000, EXEMPT_CAP)).toBe(5_000_000)
  })
})

describe('anual', () => {
  it('aplica el tope cada mes, no al total del año', () => {
    expect(yearlyGmf(20_000_000, EXEMPT_CAP)).toBeCloseTo(80_116.8, 2)
    expect(yearlyGmf(1_000_000)).toBe(48_000)
  })
})

describe('formato', () => {
  it('lee pesos colombianos', () => {
    expect(parseCOP('$ 1.500.000')).toBe(1_500_000)
    expect(parseCOP('1.500.000,55')).toBe(1_500_000.55)
    expect(parseCOP('')).toBe(0)
  })

  it('escribe pesos colombianos', () => {
    expect(formatCOP(1_004_000)).toBe('$\u00a01.004.000')
  })
})
