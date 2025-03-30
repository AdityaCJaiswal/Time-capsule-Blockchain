// pages/_app.js
import { useEffect } from "react";
import { initWeb3 } from "../../utils/web3";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initWeb3();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
