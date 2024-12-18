<script>
  import { onMount } from 'svelte'
  import DarkModeToggle from './components/DarkModeToggle.svelte'
  import ResultadoCard from './components/ResultadoCard.svelte'
  import HistorialItem from './components/HistorialItem.svelte'
  import Instrucciones from './components/Instrucciones.svelte'
  
  let monto = $state(0)
  let resultado = $state(0)
  let historial = $state([])
  let inputValue = $state('')
  let error = $state('')
  let copiado = $state(false)
  let copiadoIndex = $state(null)
  let darkMode = $state(false)
  let copiadoMonto = $state(false)
  let copiadoImpuesto = $state(false)
  let copiadoDescuento = $state(false)
  let copiadoTotal = $state(false)

  function guardarHistorial(nuevoHistorial) {
    try {
      localStorage.setItem('calculadora4x1000_historial', JSON.stringify(nuevoHistorial))
    } catch (error) {
      console.error('Error al guardar el historial:', error)
    }
  }

  function calcular4x1000() {
    if (!monto || monto <= 0) {
      error = 'Ingresa el valor para calcular tu 4x1000'
      document.getElementById('monto').focus()
      return
    }
    
    error = ''
    resultado = (monto * 4) / 1000
    const nuevoHistorial = [{
      monto,
      resultado,
      fecha: new Date().toLocaleString('es-CO')
    }, ...historial].slice(0, 10)
    
    historial = nuevoHistorial
    guardarHistorial(nuevoHistorial)

    try {
      if (window.umami) {
        umami.track('calculo_4x1000', { 
          monto: monto,
          resultado: resultado 
        })
        console.log('Evento trackeado:', { monto, resultado })
      }
    } catch (error) {
      console.error('Error al trackear:', error)
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      calcular4x1000()
    }
  }

  function handleInput(event) {
    error = ''
    const numericValue = event.target.value.replace(/\D/g, '')
    monto = numericValue ? parseInt(numericValue) : 0
    
    if (!numericValue || monto === 0) {
      resultado = 0
    }
    
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

💵 *Valor de la transacción:* ${formatearNumero(monto)}
💰 *Impuesto 4x1000:* ${formatearNumero(resultado)}
➖ *Valor descontando 4x1000:* ${formatearNumero(monto - resultado)}
➕ *Valor incluyendo 4x1000:* ${formatearNumero(monto + resultado)}

🌐 Calcula en: https://4x1000.co`
  }

  function limpiar() {
    monto = 0
    resultado = 0
    inputValue = ''
    document.getElementById('monto').focus()
  }

  async function copiar(valor, tipo, index = null) {
    try {

      
      await navigator.clipboard.writeText(valor)
      
      switch (tipo) {
        case 'monto':
          copiadoMonto = true
          setTimeout(() => copiadoMonto = false, 2000)
          break
        case 'impuesto':
          copiadoImpuesto = true
          setTimeout(() => copiadoImpuesto = false, 2000)
          break
        case 'descuento':
          copiadoDescuento = true
          setTimeout(() => copiadoDescuento = false, 2000)
          break
        case 'total':
          copiadoTotal = true
          setTimeout(() => copiadoTotal = false, 2000)
          break
        case 'resultado':
          copiado = true
          setTimeout(() => copiado = false, 2000)
          break
        case 'historial':
          copiadoIndex = index
          setTimeout(() => copiadoIndex = null, 2000)
          break
      }
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

  function limpiarHistorial() {
    historial = []
    guardarHistorial([])
  }

  // Cargar preferencia al iniciar
  onMount(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      darkMode = true
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }

    try {
      const historialGuardado = localStorage.getItem('calculadora4x1000_historial')
      if (historialGuardado) {
        historial = JSON.parse(historialGuardado)
      }
    } catch (error) {
      console.error('Error al cargar el historial:', error)
    }
  })
</script>

<div class="max-w-7xl mx-auto mt-10 p-4 md:p-8 dark:bg-gray-900">
  <DarkModeToggle {darkMode} on:click={toggleDarkMode}/>
  
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/3 order-2 lg:order-none">
      <Instrucciones />
    </div>

    <div class="lg:w-2/3 order-1 lg:order-none">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <div class="mb-2 text-center">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Calculadora 4x1000</h2>
          <p class="text-gray-600 dark:text-gray-400">Calcula el Gravamen a los Movimientos Financieros (GMF)</p>
        </div>

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

        {#if resultado > 0}
          <div class="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 rounded-lg p-4 sm:p-6 mb-6">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-white mb-4">Resultado del cálculo</h3>
            <div class="space-y-3">
              <ResultadoCard
                titulo="Valor de la transacción:"
                valor={formatearNumero(monto)}
                copiado={copiadoMonto}
                on:click={() => copiar(monto, 'monto')}
              />

              <ResultadoCard
                titulo="Impuesto 4x1000:"
                valor={formatearNumero(resultado)}
                copiado={copiadoImpuesto}
                colorTexto="text-green-600"
                darkColorTexto="dark:text-green-400"
                on:click={() => copiar(resultado, 'impuesto')}
              />

              <ResultadoCard
                titulo="Valor descontando 4x1000:"
                valor={formatearNumero(monto - resultado)}
                copiado={copiadoDescuento}
                colorTexto="text-orange-600"
                darkColorTexto="dark:text-orange-400"
                on:click={() => copiar(monto - resultado, 'descuento')}
              />

              <ResultadoCard
                titulo="Valor incluyendo 4x1000:"
                valor={formatearNumero(monto + resultado)}
                copiado={copiadoTotal}
                colorTexto="text-blue-600"
                darkColorTexto="dark:text-blue-400"
                on:click={() => copiar(monto + resultado, 'total')}
              />
            </div>

            <div class="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              <button
                onclick={() => copiar(resultado, 'resultado')}
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

        {#if historial.length > 0}
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
            <div class="flex justify-between items-center mb-3 sm:mb-4">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                Últimos cálculos
              </h3>
              <button
                onclick={limpiarHistorial}
                class="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                Limpiar historial
              </button>
            </div>
            <div class="space-y-2 sm:space-y-3">
              {#each historial as {monto, resultado, fecha}, index}
                <HistorialItem
                  {monto}
                  {resultado}
                  {fecha}
                  copiado={copiadoIndex === index}
                  on:click={() => copiar(resultado, 'historial', index)}
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div> 