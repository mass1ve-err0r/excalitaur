import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;


export default defineConfig(async () => ({
    define: {
        "window.EXCALIDRAW_ASSET_PATH": JSON.stringify("/dist/"),
        "process.env.IS_PREACT": JSON.stringify("true")
    },
    plugins: [react()],
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    build: {
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
}));
