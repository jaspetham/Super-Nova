import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
//import vitePluginString from 'vite-plugin-string'
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins:[
    svelte(),
    glsl(),
  ],
  optimizeDeps: {
    exclude: ["svelte-navigator"],
  }
})