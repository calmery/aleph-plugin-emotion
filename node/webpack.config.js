const fs = require("fs");
const glob = require("glob");
const path = require("path");

// Constants

const baseDir = process.env._ALEPH_PLUGIN_EMOTION_BASE_DIRECTORY;
const entryDir = path.resolve(baseDir, "./node/entries/");
const outputDir = path.resolve(baseDir, "./node/output/");
const sourceDir = process.env._ALEPH_PLUGIN_EMOTION_SOURCE_DIRECTORY;
const workingDir = process.env._ALEPH_PLUGIN_EMOTION_WORKING_DIRECTORY;

// Helper Functions

const getAliases = () => {
  const { imports } = require(path.resolve(workingDir, "./import_map.json"));

  // TODO: `aleph/` など、最後が `/` で終わるパスの解決ができない
  return Object.keys(imports)
    .filter((alias) => imports[alias].startsWith("https://deno.land/x/"))
    .reduce((aliases, alias) => {
      aliases[alias] = path.resolve(baseDir, "./node/proxy.js");
      return aliases;
    }, {});
};

const getEntries = () => {
  const appPath = path.resolve(sourceDir, "./app.tsx");
  const pages = glob.sync(path.resolve(sourceDir, "./pages/**/*.tsx"));

  // Codes

  const withCustomApp = `
const { default: App } = require("${appPath}");

console.log(
  extractCritical(
    renderToString(
      React.createElement(App, { pageProps: {}, Page: Component }),
    ),
  ).css,
);
  `;

  const withoutCustomApp = `
console.log(
  extractCritical(
    renderToString(React.createElement(Component)),
  ).css,
);
  `;

  //

  return pages
    .map((pageFilePath) => {
      const relativeFilePath = path.relative(sourceDir, pageFilePath);
      const entryFilePath = `${path.resolve(entryDir, relativeFilePath)}.js`;

      fs.writeFileSync(
        entryFilePath,
        `
const { extractCritical } = require("@emotion/server");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { default: Component } = require("${pageFilePath}");
        ` + (fs.existsSync(appPath) ? withCustomApp : withoutCustomApp)
      );

      return { [relativeFilePath]: entryFilePath };
    })
    .reduce((entries, entry) => ({ ...entries, ...entry }), {});
};

// Configuration

module.exports = {
  entry: getEntries(),
  mode: process.env._ALEPH_MODE || "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript", "@babel/preset-react"],
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: outputDir,
  },
  resolve: {
    alias: getAliases(),
  },
  target: "node",
};
