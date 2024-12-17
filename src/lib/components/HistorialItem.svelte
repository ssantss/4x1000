<script>
  export let monto
  export let resultado
  export let fecha
  export let copiado = false
</script>

<button
  type="button"
  class="relative w-full text-left bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
  on:click
>
  {#if copiado}
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1 animate-fade-in-right">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        Copiado
      </span>
      <div class="absolute inset-0 bg-white/30 dark:bg-gray-900/30 rounded-lg"></div>
    </div>
  {/if}
  <div>
    <span class="text-gray-600 dark:text-gray-400">Monto: </span>
    <span class="font-medium text-gray-800 dark:text-white">{monto}</span>
  </div>
  <div>
    <span class="text-gray-600 dark:text-gray-400">4x1000: </span>
    <span class="font-medium text-green-600 dark:text-green-400">{resultado}</span>
  </div>
  <div class="text-gray-500 dark:text-gray-400 text-xs">{fecha}</div>
</button> 