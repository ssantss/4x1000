<script>
  import { formatNumber } from './format.js'

  // Campo de pesos: agrega puntos de miles mientras se escribe
  let { id, label, hint = '', text = $bindable(''), placeholder = '0' } = $props()

  function onInput(event) {
    // Un punto recién tecleado cuenta como coma decimal (teclados que sólo ofrecen «.»)
    let value = event.currentTarget.value
    if (event.data === '.' && !value.includes(',')) {
      const at = event.currentTarget.selectionStart - 1
      value = value.slice(0, at) + ',' + value.slice(at + 1)
    }
    const raw = value.replace(/\./g, '').replace(/[^0-9,]/g, '')
    const [int, ...rest] = raw.split(',')
    const intText = int ? formatNumber(Number(int)) : ''
    text = rest.length ? `${intText || '0'},${rest.join('').slice(0, 2)}` : intText
    event.currentTarget.value = text
  }
</script>

<div>
  <label for={id} class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
  <div class="relative">
    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-slate-400" aria-hidden="true">$</span>
    <input
      {id}
      type="text"
      inputmode="decimal"
      autocomplete="off"
      enterkeyhint="done"
      value={text}
      oninput={onInput}
      {placeholder}
      aria-describedby={hint ? `${id}-hint` : undefined}
      class="min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-2xl font-bold tabular-nums text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
    />
    {#if text}
      <button
        type="button"
        onclick={() => (text = '')}
        class="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        aria-label="Borrar el valor"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    {/if}
  </div>
  {#if hint}
    <p id="{id}-hint" class="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
  {/if}
</div>
