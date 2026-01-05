<script>
  import Calculadora4x1000 from './lib/Calculadora4x1000.svelte'
  import Footer from './lib/Footer.svelte'
  import InstallPWA from './lib/components/InstallPWA.svelte'
  import SeoContent from './lib/SeoContent.svelte'
</script>

<div class="min-h-screen flex flex-col dark:bg-gray-900">
  <main class="container mx-auto px-4 flex-grow">
    <Calculadora4x1000 />
    <SeoContent />
  </main>
  <Footer />
  <InstallPWA />
</div>
