import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { path } = req.query
	const pathString = Array.isArray(path) ? path.join("/") : path || ""

	const targetUrl = `https://eun1.api.riotgames.com/${pathString}`

	try {
		const response = await fetch(targetUrl, {
			method: req.method,
			headers: {
				"X-Riot-Token": process.env.VITE_RIOT_API_KEY || "",
				"Content-Type": "application/json",
			},
		})

		const data = await response.json()

		res.status(response.status).json(data)
	} catch (error) {
		console.error("Riot API proxy error:", error)
		res.status(500).json({ error: "Failed to proxy request to Riot API" })
	}
}
