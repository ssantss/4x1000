<script>
  export let titulo
  export let subtitulo = ""
  export let valor
  export let copiado = false
  export let colorTexto = "text-gray-800"
  export let darkColorTexto = "dark:text-white"
  export let isPulsing = false
</script>

<button
  type="button"
  on:click
  class="w-full text-left bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative group {isPulsing ? 'pulse-animation' : ''}"
>
  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{@html titulo}</p>

  <p class="text-base sm:text-[clamp(14px,2vw,24px)] font-bold {colorTexto} {darkColorTexto}">{valor}</p>
  {#if copiado}
    <span class="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
      ¡Copiado!
    </span>
  {/if}
  {#if subtitulo}
  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{@html subtitulo}</p>
{/if}
</button>

<style>
  .pulse-animation {
    animation: pulse 1.5s infinite;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }
</style> 