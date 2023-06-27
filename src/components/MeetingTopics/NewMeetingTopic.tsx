import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button";
import { api } from "~/utils/api";

declare interface NewMeetingTopicProps {
  meetingId: string;
  locked: boolean
}

export const NewMeetingTopic = (props: NewMeetingTopicProps) => {
  const [text, setText] = useState("");
  const ctx = api.useContext();
  const createMut = api.topics.add.useMutation({
    onSuccess() {
      setText("");
      void ctx.topics.get.invalidate({ meetingId: props.meetingId })
    }
  });

  return (
    <div className="w-1/3">
      <Textarea value={text} onChange={e => setText(e.currentTarget.value)} placeholder="Meeting point" disabled={props.locked} />
      <Button className="mt-2" onClick={() => {
        createMut.mutate({
          meetingId: props.meetingId,
          message: text,
        })
      }} disabled={props.locked}>
        Submit
      </Button>
    </div>
  )
}
