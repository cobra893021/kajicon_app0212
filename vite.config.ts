import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Use (process as any) to avoid TypeScript errors if @types/node is missing.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Vercel等の環境変数(process.env.API_KEY) または .envファイルの変数(env.API_KEY) を
      // コード内の `process.env.API_KEY` に文字列として埋め込む。
      // 値がない場合は空文字を設定し、実行時エラー(undefined access)を防ぐ。
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    }
  };
});
