import Head from "next/head";
import { useEffect } from "react";
import TOSComponent from "../components/TOSComponent";

export default function Home() {
  useEffect(() => {
    console.log("home");
  }, []);
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <TOSComponent />
    </>
  );
}
