<script>
  export let activeTab = '4x1000'
  export let onchange = () => {}
</script>

<div class="flex border-b border-gray-200 dark:border-gray-800 mb-6">
  <button
    type="button"
    onclick={() => onchange('4x1000')}
    class="flex-1 py-3 px-4 text-center font-semibold transition-colors duration-200 border-b-2 {activeTab === '4x1000'
      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}"
  >
    Calculadora 4x1000
  </button>
  <button
    type="button"
    onclick={() => onchange('seguridad-social')}
    class="flex-1 py-3 px-4 text-center font-semibold transition-colors duration-200 border-b-2 {activeTab === 'seguridad-social'
      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}"
  >
    Seguridad Social
  </button>
</div>
