// Cifras tributarias del año vigente. Actualizar cada enero: UVT, SMLMV, fecha y la imagen
// public/og.png (se genera con una captura 1200x630 de scripts/og.html).

export const TAX_YEAR = 2026
export const UPDATED_LABEL = 'Actualizado: noviembre 2026'
export const UPDATED_ISO = '2026-11-17'

// 4 por mil (ET art. 872)
export const GMF_RATE = 4 / 1000

// UVT 2026: Resolución DIAN 000238 del 15-dic-2025
export const UVT = 52374

export const EXEMPT_UVT = 350
export const LOW_AMOUNT_UVT = 65
export const EXEMPT_CAP = EXEMPT_UVT * UVT // 18.330.900
export const LOW_AMOUNT_CAP = LOW_AMOUNT_UVT * UVT // 3.404.310

// Porción del GMF pagado deducible en renta (ET art. 115)
export const DEDUCTIBLE_SHARE = 0.5

// Salario mínimo mensual 2026
export const SMLMV = 1750905

export const SOURCES = {
  rate: {
    label: 'Estatuto Tributario, art. 872',
    url: 'http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario_pr034.html',
  },
  exemption: {
    label: 'Estatuto Tributario, art. 879 (num. 1 y parágrafo 4)',
    url: 'http://www.secretariasenado.gov.co/senado/basedoc/estatuto_tributario_pr035.html',
  },
  uvt: {
    label: `Resolución DIAN 000238 del 15 de diciembre de 2025 (UVT ${TAX_YEAR})`,
    url: null,
  },
  deduction: {
    label: 'Estatuto Tributario, art. 115',
    url: null,
  },
  smlmv: {
    label: `Decreto 1469 de 2025 y Decreto 0159 de 2026 (salario mínimo ${TAX_YEAR})`,
    url: 'https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/decreto_0159_2026.htm',
  },
  reform: {
    label: 'Portafolio: cambios del 4x1000 desde el 13 de diciembre (Ley 2277 de 2022, art. 65)',
    url: 'https://www.portafolio.co/economia/impuestos/4x1-000-estos-son-los-cambios-que-tendra-este-impuesto-desde-el-13-de-diciembre-618328',
  },
}
