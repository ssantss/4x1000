/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  gtag: (type: string, name: string, data: any) => void;
  dataLayer: any[];
}
