<script>
  export let titulo
  export let valor
  export let copiado = false
  export let colorTexto = "text-gray-800"
  export let darkColorTexto = "dark:text-white"
</script>

<button
  type="button"
  on:click
  class="w-full text-left bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative group"
>
  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{titulo}</p>
  <p class="text-base sm:text-[clamp(14px,2vw,24px)] font-bold {colorTexto} {darkColorTexto}">{valor}</p>
  {#if copiado}
    <span class="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
      ¡Copiado!
    </span>
  {/if}
</button> 