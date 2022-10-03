import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

export default function TOSComponent() {
  const debugRef = useRef();
  const elements = useRef([]);
  const callback = useCallback((entry) => {
    debugRef.current.innerHTML = entry.target.innerHTML;
  }, []);
  useEffect(() => {
    elements.current = document.querySelectorAll("[data-tos]");
    elements.current.forEach((el) => {
      el.addEventListener("tos-in", callback);
    });
    return () => {
      elements.current.forEach((el) =>
        el.removeEventListener("tos-in", callback)
      );
    };
  }, []);
  console.log("render");
  return (
    <main>
      <div className="container">
        <div className="row">
          <div className="w-1/2">
            <div className="link-container">
              <Link href="/otherpage">Other Page</Link>
              <Link href="/">Home Page</Link>
            </div>
            <div className="box"></div>
          </div>
          <div className="w-1/2">
            <div
              className="sbox"
              data-tos
              data-tos-target=".box"
              data-tos-in="c1"
            >
              section 1
            </div>
            <div
              className="sbox"
              data-tos
              data-tos-target=".box"
              data-tos-in="c2"
            >
              section 2
            </div>
            <div
              className="sbox"
              data-tos
              data-tos-target=".box"
              data-tos-once
              data-tos-in="c3"
            >
              section 3
            </div>
            <div
              className="sbox"
              data-tos
              data-tos-target=".box"
              data-tos-in="c4"
            >
              section 4
            </div>
            <div
              className="sbox"
              data-tos
              data-tos-target=".box"
              data-tos-in="c5"
            >
              section 5
            </div>
          </div>
        </div>
      </div>
      <div className="debug" ref={debugRef}></div>
    </main>
  );
}
