import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { path } = req.query
	const pathString = Array.isArray(path) ? path.join("/") : path || ""

	const version = process.env.VITE_DDRAGON_CDN_VERSION || "14.24.1"
	const targetUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/${pathString}`

	try {
		const response = await fetch(targetUrl, {
			method: req.method,
		})

		const contentType = response.headers.get("content-type") || ""

		if (contentType.includes("image")) {
			const buffer = await response.arrayBuffer()
			res.setHeader("Content-Type", contentType)
			res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
			res.status(response.status).send(Buffer.from(buffer))
		} else {
			const data = await response.json()
			res.setHeader("Cache-Control", "public, max-age=3600")
			res.status(response.status).json(data)
		}
	} catch (error) {
		console.error("DDragon CDN proxy error:", error)
		res.status(500).json({ error: "Failed to proxy request to DDragon CDN" })
	}
}
