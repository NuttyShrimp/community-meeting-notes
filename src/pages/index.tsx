import Head from "next/head";
import { NavBar } from "~/components/Navbar";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>DeGrens community meeting</title>
        <meta name="description" content="A application where players can add points for the community meeting in a structured way" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
    </>
  );
}
