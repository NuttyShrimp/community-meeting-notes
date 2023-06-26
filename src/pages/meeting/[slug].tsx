import { AlertTriangle, Triangle } from "lucide-react";
import { useRouter } from "next/router"
import { MeetingAdminControls } from "~/components/MeetingAdmin/Controls";
import { MeetingTopics } from "~/components/MeetingTopics"
import { NavBar } from "~/components/Navbar";
import { H3, P } from "~/components/Typography";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const MeetingView = () => {
  const router = useRouter()

  if (!router.query.slug || Array.isArray(router.query.slug)) {
    return null;
  }

  const {isLoading, isError, error, data: meeting} = api.meetings.get.useQuery({
    id: router.query.slug,
  }, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: 'always',
    retry: false,
    
  });

  if (isLoading) {
    return (
      <div className="mx-auto container">
        <H3 className="text-center">Loading meeting points...</H3>
      </div>
    )
  }

  if(isError) {
    return (
      <div className="flex items-center justify-center">
      <div className="flex flex-col items-center w-fit">
        <div className="pt-5">
          <AlertTriangle color="rgb(249 115 22)" size={"2.2rem"} />
        </div>
        <H3 className="text-center !mt-0">Failed to enter meeting</H3>
        <P className="text-destructive !mt-1">{error.message}</P>
        <div className="mt-1">
          <Button variant={"secondary"} onClick={() => {
            void router.push("/")
          }}>
            To meetinglist
          </Button>
        </div>
      </div>
      </div>
    )
  }

  return (
    <>
      <NavBar title={meeting.title} />
      <div className="px-8">
        {meeting.owner && <MeetingAdminControls />}
        <MeetingTopics meetingId={router.query.slug}  />
      </div>
    </>
  )
}

export default MeetingView
