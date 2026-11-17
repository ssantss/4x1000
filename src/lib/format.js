const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const plain = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })

// $ 1.234.567,89 en formato colombiano; el espacio tras el $ no se parte
export const formatCOP = (value) => pesos.format(value)

export const formatNumber = (value) => plain.format(value)

// Convierte lo que escribe la persona ("1.500.000,5") en número
export function parseCOP(text) {
  const clean = String(text).replace(/[^0-9,]/g, '')
  if (!clean) return 0
  const [int, dec = ''] = clean.split(',')
  return Number(`${int}.${dec.slice(0, 2)}`) || 0
}
