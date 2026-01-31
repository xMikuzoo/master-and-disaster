export const config = { runtime: "edge" }

const REGION_HOSTS: Record<string, string> = {
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

export default async function handler(request: Request) {
	const url = new URL(request.url)
	const pathParts = url.pathname.replace(/^\/api\/riotgames\//, "").split("/")
	const region = pathParts[0]
	const apiPath = pathParts.slice(1).join("/")

	const host = REGION_HOSTS[region]
	if (!host) {
		return new Response(JSON.stringify({ error: "Invalid region" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		})
	}

	const apiKey = process.env.RIOT_API_KEY
	if (!apiKey) {
		return new Response(
			JSON.stringify({ error: "API key not configured" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)
	}

	const targetUrl = `https://${host}/${apiPath}${url.search}`

	try {
		const response = await fetch(targetUrl, {
			method: request.method,
			headers: {
				"X-Riot-Token": apiKey,
				"Content-Type": "application/json",
			},
		})

		const data = await response.text()

		return new Response(data, {
			status: response.status,
			headers: {
				"Content-Type":
					response.headers.get("Content-Type") || "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			},
		})
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to fetch from Riot API" }),
			{
				status: 502,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
