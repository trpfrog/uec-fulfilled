const server = Bun.serve({
	port: 3000,
	async fetch() {
		const result = await Bun.build({
			entrypoints: ["./src/index.ts"],
			target: "browser",
			minify: true,
		});

		if (!result.success || result.outputs.length === 0) {
			return new Response(result.logs.join("\n"), {
				status: 500,
				headers: { "content-type": "text/plain" },
			});
		}

		const artifact = result.outputs[0];
		const script = await artifact.text();
		return new Response(script, {
			headers: {
				"content-type": "text/javascript",
				"Access-Control-Allow-Origin": "https://campusweb.office.uec.ac.jp",
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Private-Network": "true",
			},
		});
	},
});

console.log(`Listening on localhost:${server.port}`);
