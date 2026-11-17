<script>
  import { onMount } from 'svelte'
  import ResultadoCard from './components/ResultadoCard.svelte'
  import HistorialItem from './components/HistorialItem.svelte'
  import { formatearNumero } from '../utils/utils'

  const SMLMV = 1750905
  const IBC_MIN = SMLMV
  const IBC_MAX = 25 * SMLMV

  const PORCENTAJE_SALUD = 0.125
  const PORCENTAJE_PENSION = 0.16

  const NIVELES_ARL = [
    { nivel: 'I', porcentaje: 0.00522, descripcion: 'Riesgo mínimo' },
    { nivel: 'II', porcentaje: 0.01044, descripcion: 'Riesgo bajo' },
    { nivel: 'III', porcentaje: 0.02436, descripcion: 'Riesgo medio' },
    { nivel: 'IV', porcentaje: 0.04350, descripcion: 'Riesgo alto' },
    { nivel: 'V', porcentaje: 0.06960, descripcion: 'Riesgo máximo' }
  ]

  let ingresoBruto = $state(0)
  let inputValue = $state('')
  let nivelARL = $state(0)
  let error = $state('')
  let resultados = $state(null)
  let historial = $state([])
  let copiadoIBC = $state(false)
  let copiadoSalud = $state(false)
  let copiadoPension = $state(false)
  let copiadoARL = $state(false)
  let copiadoFSP = $state(false)
  let copiadoTotal = $state(false)
  let copiadoNeto = $state(false)
  let copiadoIndex = $state(null)

  function calcularFSP(ibc) {
    const smEnIBC = ibc / SMLMV
    if (smEnIBC <= 4) return 0
    if (smEnIBC <= 16) return 0.01
    if (smEnIBC <= 17) return 0.012
    if (smEnIBC <= 18) return 0.014
    if (smEnIBC <= 19) return 0.016
    if (smEnIBC <= 20) return 0.018
    return 0.02
  }

  function calcular() {
    if (!ingresoBruto || ingresoBruto <= 0) {
      error = 'Ingresa tu ingreso mensual bruto'
      document.getElementById('ingreso-bruto').focus()
      return
    }

    error = ''

    const ibcCalculado = Math.min(Math.max(ingresoBruto * 0.4, IBC_MIN), IBC_MAX)
    const salud = ibcCalculado * PORCENTAJE_SALUD
    const pension = ibcCalculado * PORCENTAJE_PENSION
    const arl = ibcCalculado * NIVELES_ARL[nivelARL].porcentaje
    const porcentajeFSP = calcularFSP(ibcCalculado)
    const fsp = ibcCalculado * porcentajeFSP
    const total = salud + pension + arl + fsp
    const neto = ingresoBruto - total

    resultados = {
      ibc: ibcCalculado,
      salud,
      pension,
      arl,
      fsp,
      porcentajeFSP,
      total,
      neto,
      nivelARLTexto: NIVELES_ARL[nivelARL].nivel
    }

    const nuevoHistorial = [{
      monto: ingresoBruto,
      resultado: total,
      fecha: new Date().toLocaleString('es-CO')
    }, ...historial].slice(0, 10)

    historial = nuevoHistorial
    guardarHistorial(nuevoHistorial)

    try {
      if (window.umami) {
        umami.track('calculo_seguridad_social', {
          ingreso: ingresoBruto,
          ibc: ibcCalculado,
          total: total
        })
      }
    } catch (err) {
      console.error('Error al trackear:', err)
    }
  }

  function handleKeyPress(event) {
    const inputElement = document.getElementById('ingreso-bruto')
    const currentValue = inputElement.value

    if (event.key === '.') {
      event.preventDefault()
      if (!currentValue.includes(',')) {
        inputElement.value = currentValue + ','
        inputValue = inputElement.value
        ingresoBruto = parseFloat(inputValue.replace(',', '.')) || 0
      }
      return
    }

    if (!/[0-9,]/.test(event.key)) {
      event.preventDefault()
    }

    if (event.key === ',') {
      if (currentValue.includes(',')) {
        event.preventDefault()
      }
      return
    }

    const decimalIndex = currentValue.indexOf(',')
    if (decimalIndex !== -1 && currentValue.length - decimalIndex > 2) {
      event.preventDefault()
    }

    if (event.key === 'Enter') {
      calcular()
    }
  }

  function handleInput(event) {
    error = ''

    const numericValue = event.target.value.replace(/[^0-9,]/g, '')
    ingresoBruto = numericValue ? parseFloat(numericValue.replace(',', '.')) : 0

    if (!numericValue || ingresoBruto === 0) {
      resultados = null
    }

    if (numericValue) {
      const formateado = new Intl.NumberFormat('es-CO', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(ingresoBruto)
      inputValue = `$ ${formateado}`
    } else {
      inputValue = ''
    }
  }

  function limpiar() {
    ingresoBruto = 0
    resultados = null
    inputValue = ''
    document.getElementById('ingreso-bruto').focus()
  }

  async function copiar(valor, tipo, index = null) {
    try {
      let valorRedondeado = Math.round(valor * 100) / 100
      await navigator.clipboard.writeText(valorRedondeado)

      const setters = {
        ibc: v => copiadoIBC = v,
        salud: v => copiadoSalud = v,
        pension: v => copiadoPension = v,
        arl: v => copiadoARL = v,
        fsp: v => copiadoFSP = v,
        total: v => copiadoTotal = v,
        neto: v => copiadoNeto = v,
        historial: v => copiadoIndex = v ? index : null
      }

      if (setters[tipo]) {
        setters[tipo](true)
        setTimeout(() => setters[tipo](false), 2000)
      }
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  function guardarHistorial(nuevoHistorial) {
    try {
      localStorage.setItem('seguridad_social_historial', JSON.stringify(nuevoHistorial))
    } catch (err) {
      console.error('Error al guardar el historial:', err)
    }
  }

  function limpiarHistorial() {
    historial = []
    guardarHistorial([])
  }

  onMount(() => {
    try {
      const historialGuardado = localStorage.getItem('seguridad_social_historial')
      if (historialGuardado) {
        historial = JSON.parse(historialGuardado)
      }
    } catch (err) {
      console.error('Error al cargar el historial:', err)
    }
  })
</script>

<div class="max-w-7xl mx-auto md:p-2 dark:bg-black">
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/3 order-2 lg:order-none">
      <div class="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 mb-8 lg:mb-0">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">¿Cómo funciona?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Calcula tus aportes de seguridad social como independiente</p>

        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Ingresa tu ingreso bruto mensual</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">El valor total que recibes antes de descuentos.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Selecciona tu nivel de riesgo ARL</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Depende de la actividad económica que realices.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Revisa el desglose</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Verás el IBC, salud, pensión, ARL, fondo de solidaridad y total.</p>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p class="text-xs text-gray-600 dark:text-gray-400">
            <strong class="text-gray-800 dark:text-white">IBC</strong> = 40% del ingreso bruto<br>
            Mínimo: 1 SMLMV ({formatearNumero(SMLMV)})<br>
            Máximo: 25 SMLMV ({formatearNumero(IBC_MAX)})
          </p>
        </div>
      </div>
    </div>

    <div class="lg:w-2/3 order-1 lg:order-none">
      <div class="bg-white dark:bg-gray-950 rounded-xl shadow-2xl p-6 md:p-8">
        <div class="mb-2 text-center">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Seguridad Social Independientes</h2>
          <p class="text-gray-600 dark:text-gray-400">Calcula tus aportes a salud, pensión, ARL y fondo de solidaridad</p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" for="ingreso-bruto">
              Ingreso mensual bruto
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="text"
                inputmode="decimal"
                pattern="[0-9]*"
                id="ingreso-bruto"
                value={inputValue}
                oninput={handleInput}
                onkeypress={handleKeyPress}
                class="pl-8 w-full py-3 px-4 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 dark:text-white text-lg font-medium overflow-x-auto"
                placeholder="Ingrese su ingreso bruto"
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
                <p class="text-sm text-blue-700 font-medium">{error}</p>
              </div>
            {/if}
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" for="nivel-arl">
              Nivel de riesgo ARL
            </label>
            <select
              id="nivel-arl"
              bind:value={nivelARL}
              class="w-full py-3 px-4 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 dark:text-white text-base"
            >
              {#each NIVELES_ARL as { nivel, porcentaje, descripcion }, i}
                <option value={i}>Nivel {nivel} — {descripcion} ({(porcentaje * 100).toFixed(3)}%)</option>
              {/each}
            </select>
          </div>

          <div class="flex gap-2 sm:gap-4">
            <button
              onclick={calcular}
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

        {#if resultados}
          <div class="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 rounded-lg p-4 sm:p-6 mb-6">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-white mb-4">Desglose de aportes</h3>
            <div class="space-y-3">
              <ResultadoCard
                titulo="Ingreso Base de Cotización (IBC):"
                subtitulo="40% de tu ingreso bruto (mín 1 SMLMV, máx 25 SMLMV)"
                valor={formatearNumero(resultados.ibc)}
                copiado={copiadoIBC}
                on:click={() => copiar(resultados.ibc, 'ibc')}
              />

              <ResultadoCard
                titulo="Salud (12.5%):"
                valor={formatearNumero(resultados.salud)}
                copiado={copiadoSalud}
                colorTexto="text-red-600"
                darkColorTexto="dark:text-red-400"
                on:click={() => copiar(resultados.salud, 'salud')}
              />

              <ResultadoCard
                titulo="Pensión (16%):"
                valor={formatearNumero(resultados.pension)}
                copiado={copiadoPension}
                colorTexto="text-orange-600"
                darkColorTexto="dark:text-orange-400"
                on:click={() => copiar(resultados.pension, 'pension')}
              />

              <ResultadoCard
                titulo="ARL Nivel {resultados.nivelARLTexto} ({(NIVELES_ARL[nivelARL].porcentaje * 100).toFixed(3)}%):"
                valor={formatearNumero(resultados.arl)}
                copiado={copiadoARL}
                colorTexto="text-yellow-600"
                darkColorTexto="dark:text-yellow-400"
                on:click={() => copiar(resultados.arl, 'arl')}
              />

              {#if resultados.fsp > 0}
                <ResultadoCard
                  titulo="Fondo de Solidaridad Pensional ({(resultados.porcentajeFSP * 100).toFixed(1)}%):"
                  subtitulo="Aplica cuando el IBC supera 4 SMLMV"
                  valor={formatearNumero(resultados.fsp)}
                  copiado={copiadoFSP}
                  colorTexto="text-purple-600"
                  darkColorTexto="dark:text-purple-400"
                  on:click={() => copiar(resultados.fsp, 'fsp')}
                />
              {/if}

              <div class="border-t border-blue-200 dark:border-blue-800 pt-3 mt-3">
                <ResultadoCard
                  titulo="Total aportes seguridad social:"
                  valor={formatearNumero(resultados.total)}
                  copiado={copiadoTotal}
                  colorTexto="text-blue-600"
                  darkColorTexto="dark:text-blue-400"
                  isPulsing={true}
                  on:click={() => copiar(resultados.total, 'total')}
                />
              </div>

              <ResultadoCard
                titulo="Ingreso neto después de aportes:"
                valor={formatearNumero(resultados.neto)}
                copiado={copiadoNeto}
                colorTexto="text-green-600"
                darkColorTexto="dark:text-green-400"
                on:click={() => copiar(resultados.neto, 'neto')}
              />
            </div>
          </div>
        {/if}

        {#if historial.length > 0}
          <div class="border-t border-gray-200 dark:border-gray-800 pt-4 sm:pt-6">
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
              {#each historial as { monto, resultado, fecha }, index}
                <button
                  type="button"
                  class="relative w-full text-left bg-gray-50 dark:bg-gray-950 p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  onclick={() => copiar(resultado, 'historial', index)}
                >
                  {#if copiadoIndex === index}
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                        Copiado
                      </span>
                      <div class="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-lg"></div>
                    </div>
                  {/if}
                  <div class="flex flex-col">
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{fecha}</div>
                    <div class="text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Ingreso: </span>
                      <span class="font-medium text-gray-800 dark:text-white">{formatearNumero(monto)}</span>
                      <span class="text-gray-600 dark:text-gray-400"> — Total aportes: </span>
                      <span class="font-medium text-blue-600 dark:text-blue-400">{formatearNumero(resultado)}</span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
