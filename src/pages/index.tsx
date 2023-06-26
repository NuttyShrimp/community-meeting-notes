import Head from "next/head";
import { MeetingList } from "~/components/MeetingList";
import { NavBar } from "~/components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>DeGrens community meeting</title>
        <meta name="description" content="A application where players can add points for the community meeting in a structured way" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <MeetingList />
      <div>
      </div>
    </>
  );
}
