export const config = { runtime: "edge" }

export default async function handler(request: Request) {
	const url = new URL(request.url)
	const apiPath = url.pathname.replace(/^\/api\/ddragon\//, "")

	const cdnVersion = process.env.DDRAGON_CDN_VERSION || "14.1.1"
	const targetUrl = `https://ddragon.leagueoflegends.com/cdn/${cdnVersion}/${apiPath}`

	try {
		const response = await fetch(targetUrl, {
			method: request.method,
		})

		const contentType = response.headers.get("Content-Type") || "image/png"
		const data = await response.arrayBuffer()

		return new Response(data, {
			status: response.status,
			headers: {
				"Content-Type": contentType,
				"Access-Control-Allow-Origin": "*",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		})
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to fetch from DDragon CDN" }),
			{
				status: 502,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
