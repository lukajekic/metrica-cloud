import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from 'fs'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'), // putanja do tvog key
      cert: fs.readFileSync('./certs/cert.pem'),    // putanja do tvog cert
    },
    port: 5173, // ili bilo koji port koji koristiš
  }
})
