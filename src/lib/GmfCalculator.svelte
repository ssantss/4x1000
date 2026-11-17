<script>
  import { onMount } from 'svelte'
  import Segmented from './Segmented.svelte'
  import MoneyInput from './MoneyInput.svelte'
  import { History, trackOnce } from './history.svelte.js'
  import { gmf, totalDebit, maxTransfer, taxableAmount, toCents } from './gmf.js'
  import { formatCOP, formatNumber, parseCOP } from './format.js'
  import {
    EXEMPT_CAP,
    LOW_AMOUNT_CAP,
    EXEMPT_UVT,
    LOW_AMOUNT_UVT,
    DEDUCTIBLE_SHARE,
  } from '../data/tax.js'

  const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000, 20_000_000]
  const MODES = [
    { value: 'amount', label: 'Tengo un monto' },
    { value: 'arrive', label: 'Quiero que lleguen' },
  ]
  const PERIODS = [
    { value: 'month', label: 'Mensual' },
    { value: 'year', label: 'Anual' },
  ]
  const ACCOUNTS = [
    { value: 'savings', label: `Ahorros (${EXEMPT_UVT} UVT)` },
    { value: 'lowAmount', label: `Nequi / Daviplata (${LOW_AMOUNT_UVT} UVT)` },
  ]

  let mode = $state('amount')
  let text = $state('')
  let exempt = $state(false)
  let account = $state('savings')
  let period = $state('month')
  let copied = $state(false)
  const history = new History('gmf_history')

  const amount = $derived(parseCOP(text))
  const cap = $derived(exempt ? (account === 'savings' ? EXEMPT_CAP : LOW_AMOUNT_CAP) : 0)
  // El tope es mensual: la vista anual repite el mes doce veces
  const factor = $derived(period === 'year' ? 12 : 1)
  const tax = $derived(toCents(gmf(amount, cap) * factor))
  const debit = $derived(toCents(totalDebit(amount, cap) * factor))
  const taxed = $derived(taxableAmount(amount, cap) * factor)
  const exemptPart = $derived(Math.min(amount, cap) * factor)
  const balanceMax = $derived(maxTransfer(amount, cap))
  const periodWord = $derived(period === 'year' ? 'al año' : 'al mes')

  const main = $derived(
    mode === 'amount'
      ? { label: period === 'year' ? 'GMF a pagar en el año' : 'GMF a pagar', value: tax }
      : { label: period === 'year' ? 'Necesitas tener en el año' : 'Necesitas tener en la cuenta', value: debit },
  )

  $effect(() => {
    if (amount <= 0) return history.schedule(null)
    trackOnce('calculo_4x1000')
    history.schedule({ id: `${mode}:${amount}:${cap}`, mode, amount, tax: gmf(amount, cap) })
  })

  onMount(() => {
    history.load()
    const preset = Number(new URLSearchParams(location.search).get('monto'))
    if (preset > 0) text = formatNumber(preset)
  })

  function useAmount(value) {
    text = formatNumber(value)
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(formatCOP(main.value))
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch {}
  }

  const shareText = $derived(
    mode === 'amount'
      ? `4x1000 de ${formatCOP(amount)}: ${formatCOP(gmf(amount, cap))}. Total que sale de la cuenta: ${formatCOP(totalDebit(amount, cap))}. Calcula en https://www.4x1000.co/`
      : `Para que lleguen ${formatCOP(amount)} necesitas ${formatCOP(totalDebit(amount, cap))} (4x1000: ${formatCOP(gmf(amount, cap))}). Calcula en https://www.4x1000.co/`,
  )
</script>

{#snippet row(label, value, tone = '')}
  <div class="flex justify-between gap-4 py-3">
    <dt>{label}</dt>
    <dd class="whitespace-nowrap font-semibold tabular-nums {tone}">{formatCOP(value)}</dd>
  </div>
{/snippet}

<div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
  <section class="card space-y-6" aria-label="Datos del cálculo">
    <Segmented legend="¿Qué quieres calcular?" name="mode" options={MODES} bind:value={mode} />

    <div>
      <MoneyInput
        id="amount"
        bind:text
        label={mode === 'amount' ? 'Valor del retiro, transferencia o pago' : '¿Cuánto debe llegar al destino?'}
        hint={mode === 'amount'
          ? 'El 4x1000 se cobra sobre el valor que sale de tu cuenta.'
          : 'Te decimos cuánto debes tener o consignar para que lleguen completos.'}
      />
      <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Montos rápidos">
        {#each QUICK_AMOUNTS as value}
          <button
            type="button"
            onclick={() => useAmount(value)}
            class="min-h-11 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
            class:!border-blue-600={amount === value}
            class:!text-blue-700={amount === value}
          >
            {value >= 1_000_000 ? `${value / 1_000_000} M` : `${value / 1000} mil`}
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-3">
      <label class="flex min-h-11 cursor-pointer items-start gap-3">
        <input type="checkbox" bind:checked={exempt} class="mt-1 h-5 w-5 shrink-0 rounded border-slate-400 text-blue-700 focus:ring-blue-600" />
        <span>
          <span class="font-semibold text-slate-800 dark:text-slate-100">Mi cuenta está marcada como exenta</span>
          <span class="block text-sm text-slate-500 dark:text-slate-400">Descuenta el tope mensual exento. Supone que este es todo lo que sale de esa cuenta en el mes.</span>
        </span>
      </label>
      {#if exempt}
        <Segmented legend="Tipo de cuenta exenta" name="account" options={ACCOUNTS} bind:value={account} />
      {/if}
    </div>

    <Segmented legend="Vista" name="period" options={PERIODS} bind:value={period} />
  </section>

  <section class="card flex flex-col" aria-label="Resultado">
    {#if amount > 0}
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{main.label}</p>
      <p class="mt-1 break-words text-4xl font-extrabold tabular-nums text-blue-700 sm:text-5xl dark:text-blue-400" aria-live="polite">
        {formatCOP(main.value)}
      </p>

      <dl class="mt-6 divide-y divide-slate-200 text-sm dark:divide-slate-800">
        {#if mode === 'amount'}
          {@render row(`Valor del movimiento${period === 'year' ? ' (12 meses)' : ''}`, amount * factor)}
        {:else}
          {@render row(`Llega al destino${period === 'year' ? ' (12 meses)' : ''}`, amount * factor)}
          {@render row(`4x1000 ${periodWord}`, tax)}
        {/if}
        {#if exempt}
          {@render row('Parte exenta', exemptPart, 'text-emerald-700 dark:text-emerald-400')}
          {@render row('Parte gravada', taxed)}
        {/if}
        {#if mode === 'amount'}
          {@render row('Total que sale de tu cuenta', debit)}
          {#if period === 'month'}
            {@render row('Si ese valor es todo tu saldo, puedes enviar hasta', balanceMax)}
          {/if}
        {/if}
        {#if period === 'year'}
          {@render row('Deducible en renta (50 % del GMF)', toCents(tax * DEDUCTIBLE_SHARE))}
        {/if}
      </dl>

      <div class="mt-auto flex gap-2 pt-6">
        <button
          type="button"
          onclick={copyResult}
          class="min-h-11 flex-1 rounded-xl bg-blue-700 px-4 font-semibold text-white hover:bg-blue-800"
        >
          {copied ? '¡Copiado!' : 'Copiar resultado'}
        </button>
        <a
          href="https://wa.me/?text={encodeURIComponent(shareText)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800"
        >
          Compartir por WhatsApp
        </a>
      </div>
    {:else}
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resultado</p>
      <p class="mt-1 text-4xl font-extrabold text-slate-300 sm:text-5xl dark:text-slate-700">$ 0</p>
      <p class="mt-4 text-slate-600 dark:text-slate-400">
        Escribe un monto o toca uno de los montos rápidos. El resultado aparece mientras escribes.
      </p>
    {/if}

    {#if history.items.length > 0}
      <div class="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Últimos cálculos (sólo en este dispositivo)</h2>
          <button type="button" onclick={() => history.clear()} class="min-h-11 px-2 text-xs text-slate-500 hover:text-red-600">Borrar</button>
        </div>
        <ul class="space-y-1">
          {#each history.items as item (item.id + item.date)}
            <li>
              <button
                type="button"
                onclick={() => { mode = item.mode; useAmount(item.amount) }}
                class="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>{item.mode === 'arrive' ? 'Que lleguen' : 'Monto'} {formatCOP(item.amount)}</span>
                <span class="font-semibold tabular-nums text-blue-700 dark:text-blue-400">{formatCOP(item.tax)}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </section>
</div>
