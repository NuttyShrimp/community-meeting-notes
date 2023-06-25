import { useSession } from "next-auth/react"
import { P } from "../Typography";
import { MeetingCardList } from "./CardList";

export const MeetingList = () => {
  const {data:sessionData} = useSession();

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
