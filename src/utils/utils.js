export function formatearNumero(numero) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numero)
    .replace('COP', '$')
    .trim()
  }

  export function formatearNumeroSinPeso(numero) {
    return new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(numero)
  }