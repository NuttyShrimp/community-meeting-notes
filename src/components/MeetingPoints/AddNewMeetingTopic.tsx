import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button";

export const AddNewMeetingTopic = () => {
  const [text, setText] = useState("");
  return (
    <div className="px-8">
      <div className="w-1/3">
        <Textarea value={text} onChange={e => setText(e.currentTarget.value)} placeholder="Meeting point" />
        <Button className="mt-2">
          Submit
        </Button>
      </div>
    </div>
  )
}
