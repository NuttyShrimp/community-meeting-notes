import { type TRPCClientErrorLike } from "@trpc/client";
import { useToast } from "~/components/ui/use-toast"
import { type AppRouter } from "~/server/api/root";

export const useErrorToast = () => {
  const {toast} = useToast();

  const errorToast = (error: TRPCClientErrorLike<AppRouter>) => {
    toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
    })
  }

  return {
    errorToast,
  };
}
