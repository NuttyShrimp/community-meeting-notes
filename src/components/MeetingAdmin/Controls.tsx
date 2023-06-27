import { api } from "~/utils/api";
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

declare interface ControlProps {
  meeting: {
    locked: boolean;
    id: string;
  }
}

export const MeetingAdminControls = ({ meeting }: ControlProps) => {
  const ctx = api.useContext();
  const lockMut = api.meetings.lock.useMutation({
    onSuccess() {
      void ctx.meetings.get.invalidate({
        id: meeting.id,
      })
    }
  });
  return (
    <>
      <div className="flex space-x-4">
        <Button variant={meeting.locked ? "secondary" : "default"} onClick={() => {
          void lockMut.mutate({
            meetingId: meeting.id,
            isLocked: !meeting.locked,
          })
        }}>
          {meeting.locked ? "Unlock" : "Lock"}
        </Button>
      </div>
      <Separator className="my-2" />
    </>
  )
}
