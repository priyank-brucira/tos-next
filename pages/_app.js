import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import TOS from "../utils/tos";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const tos = useRef();
  const callback = useCallback(() => {
    if (tos.current) {
      tos.current.destroy();
      tos.current.init();
    } else {
      tos.current = new TOS();
    }
  }, []);
  useEffect(() => {
    console.log("here once");
    callback();
  }, []);
  useEffect(() => {
    router.events.on("routeChangeComplete", callback);
    return () => {
      router.events.off("routeChangeComplete", () => {
        if (tos.current) {
          tos.current.destory();
        }
      });
    };
  }, [router.events]);
  return <Component {...pageProps} />;
}

export default MyApp;
