<script>
  export let monto
  export let resultado
  export let fecha
  export let copiado = false

  function formatearNumero(numero) {
    return numero.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
</script>

<button
  type="button"
  class="relative w-full text-left bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
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
  <div class="flex flex-col">
    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{fecha}</div>
    <div class="text-sm">
      <span class="text-gray-600 dark:text-gray-400">El valor de 4x1000 de </span>
      <span class="font-medium text-gray-800 dark:text-white">{formatearNumero(monto)}</span>
      <span class="text-gray-600 dark:text-gray-400"> es: </span>
      <span class="font-medium text-green-600 dark:text-green-400">{formatearNumero(resultado)}</span>
    </div>
  </div>
</button> 