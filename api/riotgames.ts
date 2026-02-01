export const config = { runtime: "edge" }

// Whitelist of valid Riot API regions
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
} as const

// Whitelist of allowed API path prefixes for security
const ALLOWED_PATH_PREFIXES = [
	"riot/account/v1/",
	"lol/summoner/v4/",
	"lol/match/v5/",
	"lol/league/v4/",
	"lol/champion-mastery/v4/",
] as const

function isValidRegion(region: string): region is keyof typeof REGION_HOSTS {
	return region in REGION_HOSTS
}

function isAllowedPath(path: string): boolean {
	return ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function sanitizePath(path: string): string {
	// Remove any path traversal attempts and normalize
	return path.replace(/\.{2,}/g, "").replace(/\/+/g, "/")
}

function getCorsHeaders(origin: string | null): Record<string, string> {
	// In production, restrict to specific domains
	// For development, allow localhost
	const allowedOrigins = [
		process.env.ALLOWED_ORIGIN,
		"http://localhost:5173",
		"http://localhost:3000",
	].filter(Boolean)

	const isAllowed = !origin || allowedOrigins.includes(origin) ||
		(process.env.ALLOWED_ORIGIN && origin.endsWith(process.env.ALLOWED_ORIGIN.replace(/^https?:\/\//, "")))

	return {
		"Access-Control-Allow-Origin": isAllowed && origin ? origin : allowedOrigins[0] || "*",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
	}
}

export default async function handler(request: Request) {
	const url = new URL(request.url)
	const origin = request.headers.get("origin")
	const corsHeaders = getCorsHeaders(origin)

	// Handle CORS preflight
	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: corsHeaders,
		})
	}

	// Only allow GET requests
	if (request.method !== "GET") {
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { "Content-Type": "application/json", ...corsHeaders },
		})
	}

	const region = url.searchParams.get("region")
	const rawPath = url.searchParams.get("path")

	if (!region || !rawPath) {
		return new Response(
			JSON.stringify({
				error: "Missing region or path",
				usage: "/api/riotgames?region=europe&path=riot/account/v1/accounts/by-riot-id/Name/Tag",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders },
			}
		)
	}

	// Validate region against whitelist
	if (!isValidRegion(region)) {
		return new Response(
			JSON.stringify({
				error: "Invalid region",
				validRegions: Object.keys(REGION_HOSTS),
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders },
			}
		)
	}

	// Sanitize and validate path
	const path = sanitizePath(rawPath)
	if (!isAllowedPath(path)) {
		return new Response(
			JSON.stringify({
				error: "Invalid API path",
				allowedPrefixes: ALLOWED_PATH_PREFIXES,
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders },
			}
		)
	}

	const apiKey = process.env.RIOT_API_KEY
	if (!apiKey) {
		// Don't expose internal configuration details
		return new Response(
			JSON.stringify({ error: "Service temporarily unavailable" }),
			{
				status: 503,
				headers: { "Content-Type": "application/json", ...corsHeaders },
			}
		)
	}

	const host = REGION_HOSTS[region]
	const targetUrl = `https://${host}/${path}`

	try {
		const response = await fetch(targetUrl, {
			method: "GET",
			headers: {
				"X-Riot-Token": apiKey,
				"Content-Type": "application/json",
			},
		})

		const data = await response.text()

		// Handle Riot API rate limiting
		if (response.status === 429) {
			const retryAfter = response.headers.get("Retry-After")
			return new Response(
				JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
				{
					status: 429,
					headers: {
						"Content-Type": "application/json",
						...(retryAfter && { "Retry-After": retryAfter }),
						...corsHeaders,
					},
				}
			)
		}

		return new Response(data, {
			status: response.status,
			headers: {
				"Content-Type": response.headers.get("Content-Type") || "application/json",
				"Cache-Control": "public, max-age=60",
				...corsHeaders,
			},
		})
	} catch (error) {
		// Log error for debugging but don't expose details
		console.error("Riot API fetch error:", error)
		return new Response(
			JSON.stringify({ error: "Failed to fetch data" }),
			{
				status: 502,
				headers: { "Content-Type": "application/json", ...corsHeaders },
			}
		)
	}
}
