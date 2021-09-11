import { Global, css } from '@emotion/react';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
        `}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
