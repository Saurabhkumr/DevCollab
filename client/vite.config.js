import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      codemirror: "codemirror/lib/codemirror.js", // Alias to fix import issues
    },
  },
  css: {
    preprocessorOptions: {
      // This will ensure Vite knows about CodeMirror's CSS
      css: {
        additionalData: '@import "codemirror/lib/codemirror.css";',
      },
    },
  },
});
