import { api } from "~/utils/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useErrorToast } from "~/lib/hooks/useErrorToast"
import { Loader } from "lucide-react"
import { type SelectProps } from "@radix-ui/react-select"

export const GuildSelector = ({className, ...props}:{className?: string} & SelectProps) => {
  const {errorToast} = useErrorToast();
  const {data: guilds, isError, isLoading, error} = api.discord.guilds.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isError) {
    errorToast(error)
  }

  return (
    <Select {...props}>
      <SelectTrigger disabled={isLoading} className={className}>
        <SelectValue placeholder={
          <>
            {isLoading && <Loader />}
            <span>Select a discord guild</span>
          </>
        } />
      </SelectTrigger>
      <SelectContent>
        {guilds && guilds.map(g => (
          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
