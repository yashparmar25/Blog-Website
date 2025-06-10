import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{//whenever there is /api in frontend it redirects to target address
        target:'http://localhost:3000',//127.0.0.1
        secure:false,
      },
    },
  },
  plugins: [react()],
})
