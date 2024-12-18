<script>
  import { onMount } from 'svelte';
  
  let deferredPrompt;
  let showInstallButton = $state(false);

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir que Chrome muestre el prompt automático
      e.preventDefault();
      // Guardar el evento para usarlo después
      deferredPrompt = e;
      // Mostrar nuestro botón personalizado
      showInstallButton = true;
    });

    // Ocultar el botón si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      showInstallButton = false;
      deferredPrompt = null;
    });
  });

  async function installApp() {
    if (!deferredPrompt) return;
    
    // Mostrar el prompt
    deferredPrompt.prompt();
    
    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    // Limpiar el prompt
    deferredPrompt = null;
    showInstallButton = false;
  }
</script>

{#if showInstallButton}
  <button
    onclick={installApp}
    class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Instalar App
  </button>
{/if} 