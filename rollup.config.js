const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const pkg = require("./package.json");
const resolve = require("rollup-plugin-node-resolve");

module.exports = {
    input: "src/index.js",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: "inline",
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: "inline",
        },
    ],
    plugins: [
        babel(),
        resolve(),
        commonjs({
            include: "node_modules/**",
        }),
    ],
    external: ["react"],
};
