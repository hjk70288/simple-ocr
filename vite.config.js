import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 절대경로 import
    },
  },
  server: {
    port: 3000,          // 기본 5173 → 3000으로 변경
    open: true,          // 서버 실행 시 브라우저 자동 오픈
    proxy: {
      // API 프록시 설정 (백엔드 연동 시)
      '/api': {
        target: 'http://localhost:8080', // Spring Boot, Node.js 등
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',      // 빌드 결과 디렉토리
    sourcemap: true,     // 빌드 후 디버깅용 소스맵 생성
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'], // 코드 스플리팅 예시
        },
      },
    },
  },
  preview: {
    port: 5000,          // `pnpm run preview` 실행 시 포트
  },
})
