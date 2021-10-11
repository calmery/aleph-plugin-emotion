import { css, injectGlobal } from "@emotion/css";
import React, { FC } from "react";

injectGlobal`
  body {
    font-size: 14px;
  }
`;

const main = css`
  color: gray;
`;

export default (
  { Page, pageProps }: { Page: FC; pageProps: Record<string, unknown> },
) => {
  return (
    <main className={main}>
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <Page {...pageProps} />
    </main>
  );
};
