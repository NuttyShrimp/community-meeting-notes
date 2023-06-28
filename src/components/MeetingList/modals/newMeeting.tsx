import { type PropsWithChildren, useState } from "react";
import { GuildSelector } from "~/components/GuildSelector";
import { P } from "~/components/Typography";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

export const NewMeetingDialog = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [guild, setGuild] = useState("");
  const utils = api.useContext();
  const createMut = api.meetings.create.useMutation({
    onSuccess() {
      void utils.meetings.list.invalidate();
      setOpen(false);
    }
  });

  const createMeeting = () => {
    createMut.mutate({
      guild,
      name,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} >
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-400">
        <DialogHeader>
          <DialogTitle>
            New Meeting
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" value={name} onChange={e => setName(e.currentTarget.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Guild
            </Label>
            <GuildSelector className="col-span-3" value={guild} onValueChange={setGuild} />
          </div>
        </div>
        {createMut.isError && (
          <div>
            <P className="text-destructive">An error occurred while creating the meeting: {createMut.error.message}</P>
          </div>
        )}
        <div>
          <Button onClick={createMeeting}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
