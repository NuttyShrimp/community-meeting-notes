import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { P } from "../Typography";

export const Auth = () => {
  const { data: sessionData } = useSession();
  
  if (!sessionData) {
    return (
      <Button onClick={() => void signIn()}>
        Sign in
      </Button>
    )
  }

  return (
    <div className='flex items-center'>
      <P>
        Welcome, {sessionData.user.name}
      </P>
      <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar className="ml-2">
              <AvatarImage src={sessionData.user.image ?? undefined} />
              <AvatarFallback>
                {sessionData.user.name?.at(0) ?? "User"}
              </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem onClick={() => void signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>
              Sign out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
