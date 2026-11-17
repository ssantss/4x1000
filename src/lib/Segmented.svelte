<script>
  // Grupo de radios con aspecto de botones segmentados
  let { legend, name, options, value = $bindable() } = $props()
</script>

<fieldset>
  <legend class="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{legend}</legend>
  <div class="grid gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" style:grid-template-columns="repeat({options.length}, minmax(0, 1fr))">
    {#each options as opt (opt.value)}
      <label class="relative">
        <input class="peer sr-only" type="radio" {name} value={opt.value} bind:group={value} />
        <span class="flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-sm font-semibold text-slate-600 transition-colors peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 dark:text-slate-300 dark:peer-checked:bg-slate-950 dark:peer-checked:text-blue-400">
          {opt.label}
        </span>
      </label>
    {/each}
  </div>
</fieldset>
