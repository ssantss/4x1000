<script>
  import { onMount } from 'svelte'
  import MoneyInput from './MoneyInput.svelte'
  import { History, trackOnce } from './history.svelte.js'
  import { formatCOP, parseCOP } from './format.js'
  import { toCents } from './gmf.js'
  import { SMLMV } from '../data/tax.js'

  const IBC_SHARE = 0.4
  const IBC_MIN = SMLMV
  const IBC_MAX = 25 * SMLMV
  const HEALTH_RATE = 0.125
  const PENSION_RATE = 0.16
  const ARL_LEVELS = [
    { level: 'I', rate: 0.00522, label: 'Riesgo mínimo' },
    { level: 'II', rate: 0.01044, label: 'Riesgo bajo' },
    { level: 'III', rate: 0.02436, label: 'Riesgo medio' },
    { level: 'IV', rate: 0.0435, label: 'Riesgo alto' },
    { level: 'V', rate: 0.0696, label: 'Riesgo máximo' },
  ]

  // Fondo de Solidaridad Pensional según el IBC en salarios mínimos
  function solidarityRate(ibc) {
    const wages = ibc / SMLMV
    if (wages <= 4) return 0
    if (wages <= 16) return 0.01
    if (wages <= 17) return 0.012
    if (wages <= 18) return 0.014
    if (wages <= 19) return 0.016
    if (wages <= 20) return 0.018
    return 0.02
  }

  const pct = (rate, digits = 1) => `${(rate * 100).toLocaleString('es-CO', { maximumFractionDigits: digits })} %`

  let text = $state('')
  let arlIndex = $state(0)
  const history = new History('social_security_history')

  const income = $derived(parseCOP(text))
  const result = $derived.by(() => {
    if (income <= 0) return null
    const ibc = Math.min(Math.max(income * IBC_SHARE, IBC_MIN), IBC_MAX)
    const fspRate = solidarityRate(ibc)
    const arl = ARL_LEVELS[arlIndex]
    const rows = [
      { label: `Salud (${pct(HEALTH_RATE)})`, value: ibc * HEALTH_RATE },
      { label: `Pensión (${pct(PENSION_RATE)})`, value: ibc * PENSION_RATE },
      { label: `ARL nivel ${arl.level} (${pct(arl.rate, 3)})`, value: ibc * arl.rate },
    ]
    if (fspRate > 0) rows.push({ label: `Fondo de Solidaridad Pensional (${pct(fspRate)})`, value: ibc * fspRate })
    const total = toCents(rows.reduce((sum, r) => sum + r.value, 0))
    return { ibc, rows, total, net: income - total }
  })

  $effect(() => {
    if (!result) return history.schedule(null)
    trackOnce('calculo_seguridad_social')
    history.schedule({ id: `${income}:${arlIndex}`, amount: income, tax: result.total })
  })

  onMount(() => history.load())
</script>

<div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
  <section class="card space-y-6" aria-label="Datos del cálculo">
    <MoneyInput
      id="income"
      bind:text
      label="Ingreso mensual bruto"
      hint="Lo que facturas o recibes en el mes, antes de descuentos."
    />
    <div>
      <label for="arl" class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Nivel de riesgo ARL</label>
      <select
        id="arl"
        bind:value={arlIndex}
        class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {#each ARL_LEVELS as arl, i}
          <option value={i}>Nivel {arl.level}: {arl.label} ({pct(arl.rate, 3)})</option>
        {/each}
      </select>
    </div>
    <p class="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <strong class="text-slate-800 dark:text-white">IBC</strong> = 40 % del ingreso bruto, entre 1 SMLMV
      ({formatCOP(IBC_MIN)}) y 25 SMLMV ({formatCOP(IBC_MAX)}).
    </p>
  </section>

  <section class="card flex flex-col" aria-label="Resultado">
    {#if result}
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total de aportes al mes</p>
      <p class="mt-1 break-words text-4xl font-extrabold tabular-nums text-blue-700 sm:text-5xl dark:text-blue-400" aria-live="polite">
        {formatCOP(result.total)}
      </p>
      <dl class="mt-6 divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <div class="flex justify-between gap-4 py-3">
          <dt>Ingreso Base de Cotización (IBC)</dt>
          <dd class="font-semibold tabular-nums">{formatCOP(toCents(result.ibc))}</dd>
        </div>
        {#each result.rows as row}
          <div class="flex justify-between gap-4 py-3">
            <dt>{row.label}</dt>
            <dd class="font-semibold tabular-nums">{formatCOP(toCents(row.value))}</dd>
          </div>
        {/each}
        <div class="flex justify-between gap-4 py-3">
          <dt>Ingreso neto después de aportes</dt>
          <dd class="font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{formatCOP(toCents(result.net))}</dd>
        </div>
      </dl>
    {:else}
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resultado</p>
      <p class="mt-1 text-4xl font-extrabold text-slate-300 sm:text-5xl dark:text-slate-700">$ 0</p>
      <p class="mt-4 text-slate-600 dark:text-slate-400">Escribe tu ingreso mensual y el desglose aparece al instante.</p>
    {/if}

    {#if history.items.length > 0}
      <div class="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Últimos cálculos (sólo en este dispositivo)</h2>
          <button type="button" onclick={() => history.clear()} class="min-h-11 px-2 text-xs text-slate-500 hover:text-red-600">Borrar</button>
        </div>
        <ul class="space-y-1 text-sm">
          {#each history.items as item (item.id + item.date)}
            <li class="flex min-h-11 items-center justify-between gap-3 px-2">
              <span>Ingreso {formatCOP(item.amount)}</span>
              <span class="font-semibold tabular-nums text-blue-700 dark:text-blue-400">{formatCOP(item.tax)}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </section>
</div>
