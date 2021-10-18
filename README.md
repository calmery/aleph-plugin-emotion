# @calmery-chan/aleph-plugin-emotion

[![@calmery-chan/aleph-plugin-emotion - npm](https://img.shields.io/npm/v/@calmery-chan/aleph-plugin-emotion.svg)](https://www.npmjs.com/package/@calmery-chan/aleph-plugin-emotion)
[![Lint](https://github.com/calmery-chan/aleph-plugin-emotion/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/calmery-chan/aleph-plugin-emotion/actions/workflows/lint.yml)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A plugin for using :woman_singer: with Aleph.js.

## Features

Can only use [@emotion/css](https://emotion.sh/docs/@emotion/css).

- [x] API
  - [x] Generate Class Names — `css`
  - [x] Global Styles — `injectGlobal`
  - [x] Animation Keyframes — `keyframes`
  - [x] Composing Class Names — `cx`
- [ ] Custom Instances
- [x] Server Side Rendering

## Usage

```
$ npm i @calmery-chan/aleph-plugin-emotion
```

```ts
// aleph.config.ts

import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import emotion from "./node_modules/@calmery-chan/aleph-plugin-emotion/plugin.ts";

export default <Config> {
  plugins: [emotion],
};
```

Internally, the React component is compiled using Babel, and then the CSS is
extracted using the `extractCritical` function in
[@emotion/server](https://www.npmjs.com/package/@emotion/server). Therefore, if
you import the npm package directly from [esm.sh](https://esm.sh/), etc., it
will fail to compile using Babel. Use
[import_map.json](https://alephjs.org/docs/basic-features/import-maps) and add
the npm package using `npm install`.

```json
// import_map.json

{
  "imports": {
    "@emotion/css": "https://esm.sh/@emotion/css@11.1.3",
    "react": "https://esm.sh/react@17.0.2"
  }
}
```

```tsx
// pages/index.ts

// import { css } from "https://esm.sh/@emotion/css@11.1.3";
// import React from "https://esm.sh/react@17.0.2";
import { css } from "@emotion/css";
import React from "react";

const container = css`
  background: #000;
  color: #FFF;
`;

export default () => {
  return (
    <div className={container}>
      Hello World
    </div>
  );
};
```

```
$ npm i -D @emotion/css react
$ aleph dev
```

See [example](./example/).
