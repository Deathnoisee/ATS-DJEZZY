import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/hr': 'http://127.0.0.1:8000',
      '/auth': 'http://127.0.0.1:8000',
      '/authentication': 'http://127.0.0.1:8000',
      '/candidate/candidate_resume': 'http://127.0.0.1:8000',
      '/candidate/candidate_skills': 'http://127.0.0.1:8000',
      '/candidate/application': 'http://127.0.0.1:8000',
    }
  }
});
