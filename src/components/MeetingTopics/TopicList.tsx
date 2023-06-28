import { api } from "~/utils/api"
import { Skeleton } from "../ui/skeleton";
import { useErrorToast } from "~/lib/hooks/useErrorToast";
import { Topic } from "./Topic";
import { Large } from "../Typography";
import { Separator } from "../ui/separator";

declare interface TopicListProps {
  meetingId: string;
  isAdmin: boolean;
}

export const TopicList = (props: TopicListProps) => {
  const { isLoading, isError, error, data: topics } = api.topics.get.useQuery({
    meetingId: props.meetingId,
  });
  const { errorToast } = useErrorToast();

  if (isLoading) {
    <div>
      <Skeleton className="w-200 h-20" />
      <Skeleton className="w-400 h-50" />
    </div>
  }

  if (isError) {
    errorToast(error)
    return null;
  }

  return (
    <div>
      {topics && topics.length > 0 ? topics.map(topic => (
        <Topic key={topic.id} topic={topic} isAdmin={props.isAdmin} />
      )) : (
        <Large>No meetings points added</Large>
      )}
      <Separator className="my-2" />
    </div>
  )
}
