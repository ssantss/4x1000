<script>
  import { onMount } from 'svelte';
  
  let deferredPrompt;
  let showInstallButton = $state(false);
  let dismissCount = $state(0);

  onMount(() => {
    const hideUntil = localStorage.getItem('hideInstallPromptUntil');
    const permanentlyHidden = localStorage.getItem('hideInstallPromptPermanently');
    const currentDismissCount = localStorage.getItem('installPromptDismissCount');
    
    if (permanentlyHidden === 'true') {
      showInstallButton = false;
      return;
    }

    if (currentDismissCount) {
      dismissCount = parseInt(currentDismissCount);
    }

    const shouldShow = !hideUntil || new Date().getTime() > parseInt(hideUntil);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton = shouldShow;
    });

    window.addEventListener('appinstalled', () => {
      showInstallButton = false;
      deferredPrompt = null;
      localStorage.removeItem('hideInstallPromptUntil');
      localStorage.removeItem('hideInstallPromptPermanently');
      localStorage.removeItem('installPromptDismissCount');
    });
  });

  async function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    showInstallButton = false;
  }

  function hidePrompt(permanent = false) {
    if (permanent) {
      localStorage.setItem('hideInstallPromptPermanently', 'true');
    } else {
      const hideUntil = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('hideInstallPromptUntil', hideUntil.toString());
      dismissCount++;
      localStorage.setItem('installPromptDismissCount', dismissCount.toString());
    }
    showInstallButton = false;
  }
</script>

{#if showInstallButton}
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 inline-block">
    <button
      onclick={installApp}
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Instalar App
    </button>

    <button
      onclick={hidePrompt}
      class="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full shadow-sm"
      aria-label="Cerrar"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
{/if} 