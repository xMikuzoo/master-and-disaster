import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")
	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			proxy: {
				"/api/riotgames/europe": {
					target: "https://europe.api.riotgames.com",
					changeOrigin: true,
					rewrite: (path) =>
						path.replace(/^\/api\/riotgames\/europe/, ""),
					headers: {
						"X-Riot-Token": env.VITE_RIOT_API_KEY,
					},
				},
				"/api/riotgames/eun1": {
					target: "https://eun1.api.riotgames.com",
					changeOrigin: true,
					rewrite: (path) =>
						path.replace(/^\/api\/riotgames\/eun1/, ""),
					headers: {
						"X-Riot-Token": env.VITE_RIOT_API_KEY,
					},
				},
				"/ddragon-cdn": {
					target: "https://ddragon.leagueoflegends.com/cdn",
					changeOrigin: true,
					rewrite: (path) =>
						path.replace(
							/^\/ddragon-cdn/,
							`/${env.VITE_DDRAGON_CDN_VERSION}`
						),
				},
			},
		},
	}
})
