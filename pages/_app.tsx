import type { AppProps } from "next/app";
import { system } from "@theme-ui/presets";
import { ThemeProvider } from "theme-ui";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={system}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
