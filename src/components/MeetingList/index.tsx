import { signIn, useSession } from "next-auth/react"
import { P } from "../Typography";
import { MeetingCardList } from "./CardList";
import { useEffect } from "react";

export const MeetingList = () => {
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData?.error === "RefreshAccessTokenError") {
      void signIn(); // Force sign in to hopefully resolve error
    }
  }, [sessionData]);

  if (!sessionData) {
    return (
      <div className="flex justify-center p-8">
        <P>
          Login in to create or edit a meeting
        </P>
      </div>
    )
  }

  return (
    <div className="px-8">
      <MeetingCardList />
    </div>
  )
}
