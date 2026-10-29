import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const removeFrameOptions = (proxy) => {
  proxy.on('proxyRes', (proxyRes) => {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  });
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-camara': { target: 'https://dadosabertos.camara.leg.br/api/v2', changeOrigin: true, rewrite: (p) => p.replace('/api-camara', '') },
      '/api-senado': { target: 'https://legis.senado.leg.br/dadosabertos', changeOrigin: true, rewrite: (p) => p.replace('/api-senado', '') },
      '/api-alrn': { target: 'https://al.rn.leg.br', changeOrigin: true, rewrite: (p) => p.replace('/api-alrn', '') },
      '/api-cmnat': { target: 'https://www.cmnat.rn.gov.br', changeOrigin: true, rewrite: (p) => p.replace('/api-cmnat', '') },
      
      '/html-camara': { target: 'https://www.camara.leg.br', changeOrigin: true, configure: removeFrameOptions, rewrite: (p) => p.replace('/html-camara', '') },
      '/html-senado': { target: 'https://www25.senado.leg.br', changeOrigin: true, configure: removeFrameOptions, rewrite: (p) => p.replace('/html-senado', '') },
      '/html-alrn': { target: 'https://al.rn.leg.br', changeOrigin: true, configure: removeFrameOptions, rewrite: (p) => p.replace('/html-alrn', '') },
      '/html-cmnat': { target: 'https://www.cmnat.rn.gov.br', changeOrigin: true, configure: removeFrameOptions, rewrite: (p) => p.replace('/html-cmnat', '') },
      '/api-tse-results': { target: 'https://resultados.tse.jus.br', changeOrigin: true, rewrite: (p) => p.replace('/api-tse-results', '') }
    }
  }
})
