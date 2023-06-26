import { NewMeetingTopic } from "./NewMeetingTopic"

declare interface MeetingTopicsProps {
  meetingId: string;
}

export const MeetingTopics = (props: MeetingTopicsProps) => {
  return (
    <>
      <NewMeetingTopic meetingId={props.meetingId} />
    </>
  )
}
