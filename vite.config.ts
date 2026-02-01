import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import type { IncomingMessage } from "http"

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
				"/api/riotgames": {
					target: "https://europe.api.riotgames.com",
					changeOrigin: true,
					configure: (proxy) => {
						proxy.on("proxyReq", (proxyReq, req) => {
							const url = new URL(req.url!, `http://${req.headers.host}`)
							const region = url.searchParams.get("region") || "europe"
							const apiPath = url.searchParams.get("path") || ""

							const regionHosts: Record<string, string> = {
								europe: "europe.api.riotgames.com",
								americas: "americas.api.riotgames.com",
								asia: "asia.api.riotgames.com",
								sea: "sea.api.riotgames.com",
								eun1: "eun1.api.riotgames.com",
								euw1: "euw1.api.riotgames.com",
								na1: "na1.api.riotgames.com",
								kr: "kr.api.riotgames.com",
								jp1: "jp1.api.riotgames.com",
								br1: "br1.api.riotgames.com",
								la1: "la1.api.riotgames.com",
								la2: "la2.api.riotgames.com",
								oc1: "oc1.api.riotgames.com",
								tr1: "tr1.api.riotgames.com",
								ru: "ru.api.riotgames.com",
								ph2: "ph2.api.riotgames.com",
								sg2: "sg2.api.riotgames.com",
								th2: "th2.api.riotgames.com",
								tw2: "tw2.api.riotgames.com",
								vn2: "vn2.api.riotgames.com",
							}

							const host = regionHosts[region] || "europe.api.riotgames.com"
							proxyReq.setHeader("host", host)
							proxyReq.setHeader("X-Riot-Token", env.VITE_RIOT_API_KEY)
							// Re-encode the path for the HTTP request (encodeURI keeps slashes)
							proxyReq.path = `/${apiPath.split("/").map(segment => encodeURIComponent(segment)).join("/")}`
						})
					},
					router: (req: IncomingMessage) => {
						const url = new URL(req.url!, `http://${req.headers.host}`)
						const region = url.searchParams.get("region") || "europe"

						const regionHosts: Record<string, string> = {
							europe: "europe.api.riotgames.com",
							americas: "americas.api.riotgames.com",
							asia: "asia.api.riotgames.com",
							sea: "sea.api.riotgames.com",
							eun1: "eun1.api.riotgames.com",
							euw1: "euw1.api.riotgames.com",
							na1: "na1.api.riotgames.com",
							kr: "kr.api.riotgames.com",
							jp1: "jp1.api.riotgames.com",
							br1: "br1.api.riotgames.com",
							la1: "la1.api.riotgames.com",
							la2: "la2.api.riotgames.com",
							oc1: "oc1.api.riotgames.com",
							tr1: "tr1.api.riotgames.com",
							ru: "ru.api.riotgames.com",
							ph2: "ph2.api.riotgames.com",
							sg2: "sg2.api.riotgames.com",
							th2: "th2.api.riotgames.com",
							tw2: "tw2.api.riotgames.com",
							vn2: "vn2.api.riotgames.com",
						}

						return `https://${regionHosts[region] || "europe.api.riotgames.com"}`
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
