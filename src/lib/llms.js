import { GUIDES, AMOUNTS, amountPath, SITE_URL } from '../data/site.js'
import { HOME_FAQ } from '../data/faq.js'
import {
  TAX_YEAR, UVT, EXEMPT_CAP, LOW_AMOUNT_CAP, EXEMPT_UVT, LOW_AMOUNT_UVT, SMLMV, SOURCES, UPDATED_LABEL,
} from '../data/tax.js'
import { formatCOP } from './format.js'
import { gmf } from './gmf.js'

// llms.txt (formato llmstxt.org) y llms-full.txt, armados desde los mismos datos del sitio

const link = (path, title, note) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ''}`

function summary() {
  return `# 4x1000.co

> Calculadora gratuita del 4x1000 (Gravamen a los Movimientos Financieros, GMF) de Colombia, con guías ${TAX_YEAR} y fuentes oficiales. ${UPDATED_LABEL}.

El 4x1000 cobra el 0,4 % de cada retiro, transferencia o pago que sale de una cuenta en Colombia: ${formatCOP(4000)} por cada ${formatCOP(1_000_000)} (Estatuto Tributario, art. 872). En ${TAX_YEAR} están exentos los primeros ${formatCOP(EXEMPT_CAP)} al mes (${EXEMPT_UVT} UVT) en la cuenta de ahorros, depósito electrónico o tarjeta prepago marcada como exenta (art. 879, num. 1), y ${formatCOP(LOW_AMOUNT_CAP)} (${LOW_AMOUNT_UVT} UVT) en depósitos de bajo monto como Nequi o Daviplata (art. 879, par. 4). El 50 % del GMF pagado es deducible en renta (art. 115).

## Datos ${TAX_YEAR}

- Tarifa: 4 por mil (0,4 %). Fórmula: monto × 0,004. Para tener el dinero: monto × 1,004. Máximo a enviar con un saldo: saldo ÷ 1,004.
- UVT ${TAX_YEAR}: ${formatCOP(UVT)}. Fuente: ${SOURCES.uvt.label}.
- Tope exento cuenta marcada: ${EXEMPT_UVT} UVT = ${formatCOP(EXEMPT_CAP)} al mes.
- Tope depósitos de bajo monto: ${LOW_AMOUNT_UVT} UVT = ${formatCOP(LOW_AMOUNT_CAP)} al mes.
- Ejemplo con exención: ${formatCOP(20_000_000)} en un mes desde cuenta exenta pagan ${formatCOP(gmf(20_000_000, EXEMPT_CAP))} (0,4 % de ${formatCOP(20_000_000 - EXEMPT_CAP)}).
- Una o varias cuentas exentas: el texto del Estatuto Tributario habla de una sola cuenta beneficiada; según Portafolio, la Ley 2277 de 2022 (art. 65) permite desde el 13 de diciembre de 2024 repartir el tope entre varias cuentas si el banco lo implementa. Hay que confirmarlo con el banco.
- Salario mínimo ${TAX_YEAR} (calculadora de seguridad social): ${formatCOP(SMLMV)}.

## Calculadoras

${link('/', `Calculadora 4x1000 Colombia ${TAX_YEAR}`, 'resultado en vivo, modo inverso, cuenta exenta y vista anual')}
${link('/seguridad-social/', 'Calculadora de seguridad social para independientes', 'salud, pensión, ARL y Fondo de Solidaridad Pensional')}

## Guías

${GUIDES.map((g) => link(g.path, g.title, g.summary)).join('\n')}

## 4x1000 por monto

${AMOUNTS.map((a) => link(amountPath(a.slug), `4x1000 de ${a.label}`, formatCOP(gmf(a.value)))).join('\n')}

## Fuentes

${Object.values(SOURCES).map((s) => `- ${s.label}${s.url ? `: ${s.url}` : ''}`).join('\n')}
`
}

export const llmsTxt = () => summary()

export const llmsFullTxt = () => `${summary()}
## Preguntas frecuentes

${HOME_FAQ.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}
`
