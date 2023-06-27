import { NewMeetingTopic } from "./NewMeetingTopic"

declare interface MeetingTopicsProps {
  meeting: {
    id: string;
    locked: boolean;
  }
}

export const MeetingTopics = ({ meeting }: MeetingTopicsProps) => {
  return (
    <>
      <NewMeetingTopic locked={meeting.locked} meetingId={meeting.id} />
    </>
  )
}
