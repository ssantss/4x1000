<script>
  import { onMount } from 'svelte'
  
  let monto = $state(0)
  let resultado = $state(0)
  let historial = $state([])
  let inputValue = $state('')
  let error = $state('')
  let copiado = $state(false)
  let copiadoIndex = $state(null)
  let darkMode = $state(false)

  function calcular4x1000() {
    if (!monto || monto <= 0) {
      error = 'Ingresa el valor para calcular tu 4x1000'
      document.getElementById('monto').focus()
      return
    }
    
    error = ''
    resultado = (monto * 4) / 1000
    historial = [{
      monto,
      resultado,
      fecha: new Date().toLocaleString('es-CO')
    }, ...historial].slice(0, 5) 
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      calcular4x1000()
    }
  }

  function handleInput(event) {
    error = ''
    // Eliminar todo excepto números
    const numericValue = event.target.value.replace(/\D/g, '')
    monto = numericValue ? parseInt(numericValue) : 0
    
    // Si el valor es 0 o está vacío, limpiar el resultado
    if (!numericValue || monto === 0) {
      resultado = 0
    }
    
    // Formatear para mostrar en el input
    if (numericValue) {
      const formateado = new Intl.NumberFormat('es-CO', {
        style: 'decimal',
        maximumFractionDigits: 0
      }).format(monto)
      inputValue = `$ ${formateado}`
    } else {
      inputValue = ''
    }
  }

  function formatearNumero(numero) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numero)
    .replace('COP', '$')
    .trim()
  }

  function formatearMensajeWhatsApp(monto, resultado) {
    return `📊 *CALCULADORA 4x1000*

💵 *Monto:* ${formatearNumero(monto)}
💰 *Valor 4x1000:* ${formatearNumero(resultado)}

🌐 Calcula en: https://4x1000.co`
  }

  function limpiar() {
    monto = 0
    resultado = 0
    inputValue = ''
    document.getElementById('monto').focus()
  }

  async function copiarResultado() {
    try {
      // Usar el formateador pero solo para el número, sin el símbolo de moneda
      const valorFormateado = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(resultado)
      
      await navigator.clipboard.writeText(valorFormateado)
      copiado = true
      setTimeout(() => {
        copiado = false
      }, 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  function copiarResultadoHistorial(valor, index) {
    try {
      const valorFormateado = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor)
      
      navigator.clipboard.writeText(valorFormateado)
      copiadoIndex = index
      setTimeout(() => {
        copiadoIndex = null
      }, 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode
    document.documentElement.classList.toggle('dark')
    // Opcional: guardar preferencia en localStorage
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
  }

  // Cargar preferencia al iniciar
  onMount(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      darkMode = true
      document.documentElement.classList.add('dark')
    } else {
      // Asegurarnos que se quite la clase dark si existe
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  })
</script>

<div class="max-w-7xl mx-auto mt-10 p-4 md:p-8 dark:bg-gray-900">
  <button
    onclick={toggleDarkMode}
    class="fixed right-0 top-0 p-2 rounded-bl-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-50"
    title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
  >
    {#if darkMode}
      <!-- Sol -->
      <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
      </svg>
    {:else}
      <!-- Luna -->
      <svg class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    {/if}
  </button>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/3 order-2 lg:order-none">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 lg:mb-0">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">¿Cómo calcular el impuesto 4×1000?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-8">Sigue estos tres pasos fácil y rápido</p>
        
        <div class="space-y-8">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                1
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Ingresa el valor de la transacción</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Asegúrate de poner el valor correcto, para que puedas obtener resultados precisos.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                2
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Haz clic en "Calcular"</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                La calculadora realiza la operación del impuesto 4×1000 automáticamente.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                3
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Revisa los resultados</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                La calculadora te mostrará el monto del impuesto 4×1000 correspondiente a la transacción ingresada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:w-2/3 order-1 lg:order-none">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Calculadora 4x1000</h2>
          <p class="text-gray-600 dark:text-gray-400">Calcula el Gravamen a los Movimientos Financieros (GMF)</p>
        </div>

        <!-- Formulario principal -->
        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" for="monto">
              Monto a calcular
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                id="monto"
                value={inputValue}
                oninput={handleInput}
                onkeypress={handleKeyPress}
                class="pl-8 w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 dark:text-white text-lg font-medium overflow-x-auto"
                placeholder="Ingrese el valor"
                autocomplete="off"
              />
              {#if inputValue}
                <button
                  type="button"
                  aria-label="Limpiar valor"
                  onclick={limpiar}
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              {/if}
            </div>
            {#if error}
              <div class="mt-3 flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-3 rounded-xl animate-fade-in">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm text-blue-700 font-medium">
                  {error}
                </p>
              </div>
            {/if}
          </div>

          <div class="flex gap-2 sm:gap-4">
            <button
              onclick={calcular4x1000}
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Calcular
            </button>
            <button
              onclick={limpiar}
              class="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Limpiar
            </button>
          </div>
        </div>

        <!-- Resultado -->
        {#if resultado > 0}
          <div class="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-white mb-4">Resultado del cálculo</h3>
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <div class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Monto ingresado:</p>
                <p class="text-base sm:text-[clamp(14px,2vw,24px)] font-bold text-gray-800 dark:text-white whitespace-nowrap">{formatearNumero(monto)}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Valor del 4x1000:</p>
                <p class="text-base sm:text-[clamp(14px,2vw,24px)] font-bold text-green-600 dark:text-white whitespace-nowrap">{formatearNumero(resultado)}</p>
              </div>
            </div>
            <div class="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              <button
                onclick={copiarResultado}
                class="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {#if copiado}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  {/if}
                </svg>
                <span class="font-semibold tracking-wide">
                  {copiado ? '¡Copiado!' : 'Copiar'}
                </span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(formatearMensajeWhatsApp(monto, resultado))}`}
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-0 text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="font-semibold tracking-wide truncate">Compartir</span>
              </a>
            </div>
          </div>
        {/if}

        <!-- Historial -->
        {#if historial.length > 0}
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">Últimos cálculos</h3>
            <div class="space-y-2 sm:space-y-3">
              {#each historial as {monto, resultado, fecha}, index}
                <button
                  type="button"
                  class="relative w-full text-left bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg flex justify-between items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  onclick={() => copiarResultadoHistorial(resultado, index)}
                >
                  {#if copiadoIndex === index}
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
                    <span class="font-medium text-gray-800 dark:text-white">{formatearNumero(monto)}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">4x1000: </span>
                    <span class="font-medium text-green-600 dark:text-green-400">{formatearNumero(resultado)}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs">{fecha}</div>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div> 