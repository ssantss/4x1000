<script>
  import Calculadora4x1000 from './lib/Calculadora4x1000.svelte'
  import CalculadoraSeguridadSocial from './lib/CalculadoraSeguridadSocial.svelte'
  import TabNavigation from './lib/components/TabNavigation.svelte'
  import Footer from './lib/Footer.svelte'
  import InstallPWA from './lib/components/InstallPWA.svelte'
  import SeoContent from './lib/SeoContent.svelte'

  let activeTab = $state('4x1000')
</script>

<div class="min-h-screen flex flex-col dark:bg-black">
  <main class="container mx-auto px-4 flex-grow">
    <div class="max-w-7xl mx-auto mt-10 md:p-2">
      <TabNavigation {activeTab} onchange={(tab) => activeTab = tab} />
    </div>
    <div class:hidden={activeTab !== '4x1000'}>
      <Calculadora4x1000 />
    </div>
    <div class:hidden={activeTab !== 'seguridad-social'}>
      <CalculadoraSeguridadSocial />
    </div>
    <SeoContent />
  </main>
  <Footer />
  <InstallPWA />
</div>
