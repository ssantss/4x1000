import { formatCOP } from '../lib/format.js'
import { TAX_YEAR, UVT, EXEMPT_CAP, LOW_AMOUNT_CAP, EXEMPT_UVT, LOW_AMOUNT_UVT } from './tax.js'

// Preguntas compartidas por la portada, las guías y llms-full.txt

export const FAQ_RATE = {
  q: '¿Cuánto es el 4x1000?',
  a: `Es el 0,4 % del valor que sale de una cuenta: 4 pesos por cada 1.000. Un movimiento de ${formatCOP(1_000_000)} paga ${formatCOP(4000)} de GMF. La tarifa está en el artículo 872 del Estatuto Tributario.`,
}

export const FAQ_EXEMPT_CAP = {
  q: `¿Cuánto dinero está exento del 4x1000 en ${TAX_YEAR}?`,
  a: `Los retiros de hasta ${EXEMPT_UVT} UVT al mes en la cuenta de ahorros, depósito electrónico o tarjeta prepago marcada como exenta (art. 879, numeral 1, del Estatuto Tributario). Con la UVT ${TAX_YEAR} de ${formatCOP(UVT)}, el tope es ${formatCOP(EXEMPT_CAP)} al mes.`,
}

export const FAQ_MULTIPLE_ACCOUNTS = {
  q: '¿Puedo tener varias cuentas exentas del 4x1000?',
  a: 'Hay dos lecturas. El texto del Estatuto Tributario habla de una sola cuenta beneficiada por titular. Según la prensa (Portafolio), la Ley 2277 de 2022 permite desde el 13 de diciembre de 2024 repartir el tope exento entre varias cuentas, siempre que los bancos lo hayan implementado. Confirma con tu banco cómo lo aplica.',
}

export const FAQ_LOW_AMOUNT = {
  q: '¿Nequi y Daviplata cobran 4x1000?',
  a: `Los depósitos de bajo monto, como Nequi o Daviplata, están exentos hasta ${LOW_AMOUNT_UVT} UVT al mes (art. 879, parágrafo 4, del Estatuto Tributario): ${formatCOP(LOW_AMOUNT_CAP)} en ${TAX_YEAR}. Lo que pase de ese tope paga el 0,4 %.`,
}

export const FAQ_DEDUCTION = {
  q: '¿El 4x1000 se puede deducir en la declaración de renta?',
  a: 'Sí. El 50 % del GMF efectivamente pagado en el año es deducible en la declaración de renta (art. 115 del Estatuto Tributario). El banco te entrega el certificado con lo que pagaste.',
}

export const FAQ_PRIVACY = {
  q: '¿La calculadora guarda mis datos?',
  a: 'No. Las cuentas se hacen en tu navegador y no se envían a ningún servidor. Los últimos cálculos se guardan sólo en tu dispositivo y puedes borrarlos. La analítica de visitas es anónima y no registra montos ni resultados.',
}

export const HOME_FAQ = [
  FAQ_RATE,
  FAQ_EXEMPT_CAP,
  FAQ_MULTIPLE_ACCOUNTS,
  FAQ_LOW_AMOUNT,
  {
    q: '¿Quién paga el 4x1000?',
    a: 'El titular de la cuenta de la que sale el dinero. El banco lo descuenta automáticamente, además del valor del retiro o la transferencia, por eso necesitas un poco más de saldo que el monto que vas a mover.',
  },
  FAQ_DEDUCTION,
  FAQ_PRIVACY,
]
