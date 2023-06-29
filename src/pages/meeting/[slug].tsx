import { AlertTriangle } from "lucide-react";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { useEffect } from "react";
import { MeetingAdminControls } from "~/components/MeetingAdmin/Controls";
import { MeetingTopics } from "~/components/MeetingTopics"
import { NavBar } from "~/components/Navbar";
import { H3, P } from "~/components/Typography";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const MeetingView: NextPage = () => {
  const router = useRouter()

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && !session) {
      void signIn();
    }
  }, [status, session])

  const { isLoading, isError, error, data: meeting } = api.meetings.get.useQuery({
    id: router.query.slug !== undefined ? Array.isArray(router.query.slug) ? router.query.slug?.[0] ?? "" : router.query.slug : "",
  }, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!router.query.slug
  });

  if (status === "loading") {
    return (
      <div className="mx-auto container">
        <H3 className="text-center">Loading account information...</H3>
      </div>
    )
  }

  if (!session) {
    return <div>Redirecting to signin</div>
  }


  if (isLoading) {
    return (
      <div className="mx-auto container">
        <H3 className="text-center">Loading meeting points...</H3>
      </div>
    )
  }

  if (isError) {
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
              To Meetings
            </Button>
            <Button variant={"secondary"} onClick={() => {
              void signIn();
            }}>
              Sign In
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
        {meeting.owner && <MeetingAdminControls meeting={meeting} />}
        <MeetingTopics meeting={meeting} />
      </div>
    </>
  )
}

export default MeetingView
