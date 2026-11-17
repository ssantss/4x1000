export const SITE_URL = 'https://www.4x1000.co'
export const SITE_NAME = '4x1000.co'

// Guías: alimentan /guias/, enlaces relacionados y llms.txt
export const GUIDES = [
  {
    path: '/como-calcular-4x1000/',
    title: 'Cómo calcular el 4x1000 paso a paso',
    summary: 'La fórmula del 0,4 %, ejemplos y cómo saber cuánto necesitas tener en la cuenta.',
  },
  {
    path: '/exenciones-4x1000/',
    title: 'Exenciones del 4x1000 en 2026',
    summary: 'El tope exento de 350 UVT, el de 65 UVT para bajo monto y el debate sobre una o varias cuentas.',
  },
  {
    path: '/cuenta-exenta-4x1000/',
    title: 'Cómo marcar tu cuenta exenta del 4x1000',
    summary: 'Qué cuentas se pueden marcar, qué preguntarle al banco y qué pasa si te pasas del tope.',
  },
  {
    path: '/4x1000-nequi-daviplata/',
    title: '4x1000 en Nequi y Daviplata',
    summary: 'El tope de 65 UVT de los depósitos de bajo monto y cuándo empiezas a pagar.',
  },
  {
    path: '/deducir-4x1000-renta/',
    title: 'Cómo deducir el 4x1000 en la declaración de renta',
    summary: 'El 50 % del GMF pagado es deducible: cálculo y qué certificado pedir.',
  },
  {
    path: '/tabla-4x1000/',
    title: 'Tabla del 4x1000 por montos',
    summary: 'El GMF de los montos más comunes, con y sin cuenta exenta.',
  },
]

// Montos con página propia: /4x1000-de-<slug>/
export const AMOUNTS = [
  {
    slug: '100-mil',
    value: 100_000,
    label: '100 mil pesos',
    context: 'Es el tamaño típico de un pago del día a día: un mercado pequeño, una transferencia a un familiar o el pago de un servicio.',
  },
  {
    slug: '500-mil',
    value: 500_000,
    label: '500 mil pesos',
    context: 'Un monto frecuente para arriendos de habitación, cuotas o compras medianas pagadas por transferencia.',
  },
  {
    slug: '1-millon',
    value: 1_000_000,
    label: '1 millón de pesos',
    context: 'Es la cifra de referencia del impuesto: por cada millón que sale de una cuenta gravada se pagan 4.000 pesos.',
  },
  {
    slug: '2-millones',
    value: 2_000_000,
    label: '2 millones de pesos',
    context: 'Un monto cercano a un salario mínimo con auxilio de transporte, o a un arriendo mensual en ciudad.',
  },
  {
    slug: '5-millones',
    value: 5_000_000,
    label: '5 millones de pesos',
    context: 'A partir de aquí el monto supera el tope de 65 UVT de los depósitos de bajo monto (Nequi, Daviplata), así que ahí sí se paga una parte.',
  },
  {
    slug: '10-millones',
    value: 10_000_000,
    label: '10 millones de pesos',
    context: 'Un pago grande, como la cuota inicial de un vehículo o la liquidación de un contrato, que todavía cabe dentro del tope de 350 UVT de una cuenta exenta.',
  },
  {
    slug: '20-millones',
    value: 20_000_000,
    label: '20 millones de pesos',
    context: 'Supera el tope mensual de 350 UVT, así que incluso con la cuenta marcada como exenta se paga 4x1000 sobre el excedente.',
  },
  {
    slug: '50-millones',
    value: 50_000_000,
    label: '50 millones de pesos',
    context: 'Montos como este aparecen en compras de vehículo o abonos a vivienda; la exención cubre menos de la mitad.',
  },
  {
    slug: '100-millones',
    value: 100_000_000,
    label: '100 millones de pesos',
    context: 'En movimientos de este tamaño, como la venta de un inmueble, la exención mensual pesa poco y casi todo el monto queda gravado.',
  },
]

export const amountPath = (slug) => `/4x1000-de-${slug}/`
