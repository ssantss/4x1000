<script>
  let monto = $state(0)
  let resultado = $state(0)
  let historial = $state([])
  let inputValue = $state('')
  let error = $state('')

  function calcular4x1000() {
    if (!monto || monto <= 0) {
      error = 'Ingresa el valor para calcular tu 4x1000'
      document.getElementById('monto').focus()
      return
    }
    
    error = ''
    resultado = (monto * 4) / 1000
    try {
      window.gtag('event', 'calculo_realizado', {
        'monto': monto,
        'resultado': resultado
      });
    } catch (e) {
      console.log('Analytics no disponible');
    }
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
</script>

<div class="max-w-7xl mx-auto mt-10 p-4 md:p-8">
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-1/3 order-2 lg:order-none">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 lg:mb-0">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">¿Cómo calcular el impuesto 4×1000?</h2>
        <p class="text-gray-600 mb-8">Sigue estos tres pasos fácil y rápido</p>
        
        <div class="space-y-8">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <span class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                1
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">Ingresa el valor de la transacción</h3>
              <p class="text-gray-600 text-sm">
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
              <h3 class="font-semibold text-gray-800 mb-1">Haz clic en "Calcular"</h3>
              <p class="text-gray-600 text-sm">
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
              <h3 class="font-semibold text-gray-800 mb-1">Revisa los resultados</h3>
              <p class="text-gray-600 text-sm">
                La calculadora te mostrará el monto del impuesto 4×1000 correspondiente a la transacción ingresada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:w-2/3 order-1 lg:order-none">
      <div class="bg-white rounded-xl shadow-2xl p-6 md:p-8">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Calculadora 4x1000</h2>
          <p class="text-gray-600">Calcula el Gravamen a los Movimientos Financieros (GMF)</p>
        </div>

        <!-- Formulario principal -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="monto">
              Monto a calcular
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                id="monto"
                value={inputValue}
                oninput={handleInput}
                onkeypress={handleKeyPress}
                class="pl-8 w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingrese el valor"
                autocomplete="off"
              />
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

          <div class="flex gap-4">
            <button
              onclick={calcular4x1000}
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Calcular
            </button>
            <button
              onclick={limpiar}
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition duration-200"
            >
              Limpiar
            </button>
          </div>
        </div>

        <!-- Resultado -->
        {#if resultado > 0}
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">Resultado del cálculo</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Monto ingresado:</p>
                <p class="text-xl font-bold text-gray-800">{formatearNumero(monto)}</p>
              </div>
              <div class="bg-white p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Valor del 4x1000:</p>
                <p class="text-xl font-bold text-green-600">{formatearNumero(resultado)}</p>
              </div>
            </div>
            <div class="mt-6 flex justify-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(formatearMensajeWhatsApp(monto, resultado))}`}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="font-semibold tracking-wide">Compartir resultado</span>
              </a>
            </div>
          </div>
        {/if}

        <!-- Historial -->
        {#if historial.length > 0}
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Últimos cálculos</h3>
            <div class="space-y-3">
              {#each historial as {monto, resultado, fecha}}
                <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <span class="text-gray-600">Monto: </span>
                    <span class="font-medium">{formatearNumero(monto)}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">4x1000: </span>
                    <span class="font-medium text-green-600">{formatearNumero(resultado)}</span>
                  </div>
                  <div class="text-gray-500 text-xs">{fecha}</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div> 