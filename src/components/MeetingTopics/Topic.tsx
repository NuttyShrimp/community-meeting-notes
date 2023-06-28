import { MessageSquare, Trash2 } from "lucide-react";
import { P, Small } from "../Typography";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, type ButtonProps } from "../ui/button";
import { useCallback, useState } from "react";
import { Textarea } from "../ui/textarea";
import { api } from "~/utils/api";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";

declare interface TopicMessageProps {
  message: {
    note: string;
    id: number;
    user: {
      name: string | null;
      image: string | null;
    }
  }
  actions: {
    name: string;
    icon: JSX.Element,
    variant?: ButtonProps['variant'];
    onClick: () => void;
  }[]
}

const TopicMessage = ({ message, actions }: TopicMessageProps) => {
  return (
    <div className="p-3 mb-1 w-fit min-w-[200px] rounded-lg bg-card border relative hover:shadow-md">
      <div className='flex items-center'>
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src={message.user.image ?? ""} />
          <AvatarFallback>{message.user?.name ? message.user.name.at(0) : "?"}</AvatarFallback>
        </Avatar>
        <Small>{message.user.name ?? "Unknown user"}</Small>
      </div>
      <P className="!mt-1">
        {message.note}
      </P>
      <div className="absolute right-0 bottom-0">
        {actions.map(a => (
          <Button key={a.name} variant={a.variant ?? 'ghost'} size='icon' className="h-7 w-7" onClick={a.onClick}>
            {a.icon}
          </Button>
        ))}
      </div>
    </div>
  )
}

declare interface TopicProps {
  topic: {
    id: number;
    note: string;
    meetingId: string;
    userId: string;
    user: {
      name: string | null;
      image: string | null;
    }
  }
  isAdmin: boolean;
}

export const Topic = ({ topic, isAdmin }: TopicProps) => {
  const session = useSession();
  const ctx = api.useContext();
  const { isError, error, isLoading, data: comments } = api.topics.getComments.useQuery({
    topicId: topic.id,
  }, {
    refetchOnWindowFocus: false,
  });
  const deleteTopicMut = api.topics.delete.useMutation({
    onSuccess() {
      void ctx.topics.get.invalidate({
        meetingId: topic.meetingId,
      });
    }
  })
  const [showCommentField, setShowCommentField] = useState(false);
  const [commentField, setCommentField] = useState("")
  const addCommentMut = api.topics.addComment.useMutation({
    onSuccess() {
      void ctx.topics.getComments.invalidate({
        topicId: topic.id
      })
      setCommentField("");
      setShowCommentField(false);
    }
  });
  const removeCommentMut = api.topics.deleteComment.useMutation({
    onSuccess() {
      void ctx.topics.getComments.invalidate({
        topicId: topic.id
      })
    }
  })

  const addComment = () => {
    if (commentField === "") return;
    addCommentMut.mutate({
      topicId: topic.id,
      comment: commentField
    })
  }

  const topicActions = useCallback(() => {
    const actions: TopicMessageProps["actions"] = [
      {
        name: "comment",
        onClick: () => setShowCommentField(true),
        icon: <MessageSquare size="1rem" />
      }
    ]

    if (isAdmin || topic.userId === session.data?.user.id) {
      actions.push(
        {
          name: "delete",
          variant: "ghost_destructive",
          onClick: () => deleteTopicMut.mutate({ topicId: topic.id }),
          icon: <Trash2 size="1rem" />
        }
      )
    }

    return actions;
  }, [topic, session, deleteTopicMut, isAdmin])

  return (
    <div className="w-fit" onMouseLeave={() => {
      if (commentField !== "") return;
      setShowCommentField(false)
    }}>
      <TopicMessage message={topic} actions={topicActions()} />
      <div className="ml-8 mt-1">
        {isError && (
          <Alert variant={'destructive'}>
            <AlertDescription>
              An error occurred while loading the comments of this topic<br />
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="mb-1 border rounded-lg p-2">
            <Skeleton className="w-28 h-2 mb-2" />
            <Skeleton className="w-64 h-2" />
          </div>
        )}
        {comments && comments.map(c => (
          <TopicMessage key={c.id} message={c} actions={(isAdmin || c.userId === session.data?.user.id) ? [
            {
              name: "delete",
              variant: "ghost_destructive",
              onClick: () => removeCommentMut.mutate({ commentId: c.id }),
              icon: <Trash2 size="1rem" />
            },
          ] : []} />
        ))}
        {showCommentField && (
          <div>
            <Textarea placeholder="Add a comment" value={commentField} onChange={e => setCommentField(e.currentTarget.value)} disabled={addCommentMut.isLoading} />
            <Button className="mt-1" size="sm" onClick={addComment} disabled={addCommentMut.isLoading} >Add comment</Button>
          </div>
        )}
      </div>
    </div>
  )
}
