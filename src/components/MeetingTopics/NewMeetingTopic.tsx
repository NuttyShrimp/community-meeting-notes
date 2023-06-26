import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button";

declare interface NewMeetingTopicProps {
  meetingId: string;
}

export const NewMeetingTopic = (props: NewMeetingTopicProps) => {
  const [text, setText] = useState("");
  return (
    <div className="w-1/3">
      <Textarea value={text} onChange={e => setText(e.currentTarget.value)} placeholder="Meeting point" />
      <Button className="mt-2">
        Submit
      </Button>
    </div>
  )
}
