import Head from "next/head";
import { useEffect } from "react";
import TOSComponent from "../components/TOSComponent";

export default function OtherPage() {
  useEffect(() => {
    console.log("OtherPage");
  }, []);
  return (
    <>
      <Head>
        <title>Other Page</title>
      </Head>
      <TOSComponent />
    </>
  );
}
