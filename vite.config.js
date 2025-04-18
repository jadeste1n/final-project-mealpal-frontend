import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	plugins: [
		react(),
		tailwindcss(),
		svgr({
			exportAsDefault: false, // <-- allows named export (ReactComponent)
			svgrOptions: {
				icon: true,
			},
		}),
	],
});
