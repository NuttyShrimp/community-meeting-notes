import { NewMeetingTopic } from "./NewMeetingTopic"
import { TopicList } from "./TopicList";

declare interface MeetingTopicsProps {
  meeting: {
    id: string;
    locked: boolean;
    owner: boolean;
  }
}

export const MeetingTopics = ({ meeting }: MeetingTopicsProps) => {
  return (
    <>
      <TopicList isAdmin={meeting.owner} meetingId={meeting.id} />
      <NewMeetingTopic locked={meeting.locked} meetingId={meeting.id} />
    </>
  )
}
