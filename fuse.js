const { FuseBox, QuantumPlugin, CSSPlugin, CSSResourcePlugin, WebIndexPlugin, HTMLPlugin, BabelPlugin, JSONPlugin } = require("fuse-box");

const isProduction = /prod/.test(process.env.NODE_ENV || "dev");

const fuse = new FuseBox({
	homeDir: "app/",
	output: "dist/$name.js",
	target: "browser",
	sourceMaps: { inline: false, sourceRoot: "app" },
	hash: isProduction,
	cache: !isProduction,
	plugins: [
		[CSSResourcePlugin(), CSSPlugin()],
		JSONPlugin(),
		BabelPlugin(),
		HTMLPlugin({ useDefault: false }),
		WebIndexPlugin({ template: "app/template.html" })
	]
});

if (!isProduction) {
	fuse.dev({ port: 9000 });
}

const appBundle = fuse.bundle("app")
	.instructions(">scripts/index.js");

if (!isProduction) {
	appBundle.hmr().watch();
}

fuse.run();