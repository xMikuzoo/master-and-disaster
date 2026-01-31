export const config = { runtime: "edge" }

export default function handler() {
	return new Response(JSON.stringify({ pong: true, time: Date.now() }), {
		headers: { "Content-Type": "application/json" }
	})
}
