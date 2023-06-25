import { api } from "~/utils/api"
import { Skeleton } from "../ui/skeleton";
import { useErrorToast } from "~/lib/hooks/useErrorToast";
import { Card, CardContent } from "../ui/card";
import { H3, P } from "../Typography";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "./modals/newMeeting";

export const MeetingCardList = () => {
  const { errorToast } = useErrorToast()
  const { data: list, isError, isLoading, error } = api.meetings.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center sm:space-x-4">
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
      </div>
    )
  }

  if (isError) {
    errorToast(error)
  }

  if (!list || list.length === 0) {
    return (
      <div className="flex justify-center">
        <NewMeetingDialog>
          <Button>
            Create a new meeting
          </Button>
        </NewMeetingDialog>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap space-x-4">
      {list.map(m => (
        <Card key={m.id} className="h-36 w-48">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <P className='text-center'>
              {m.title}
            </P>
          </CardContent>
        </Card>
      ))}
      <NewMeetingDialog>
        <Card className="h-36 w-48">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <PlusIcon size={'2rem'} />
            <P className="!mt-2">
              Create new
            </P>
          </CardContent>
        </Card>
      </NewMeetingDialog>
    </div>
  )
}
