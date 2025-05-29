import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  base: "/", // ✅ Dev mode cần base: "/"
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target:
          "https://lms-cnnet-gjeydkc6e8h8esbx.southeastasia-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  // Cấu hình public directory
  publicDir: "public", // 👈 Thư mục public gốc
});
