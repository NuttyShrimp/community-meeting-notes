import { prisma } from "../db"

export const fetchFromDiscord = async <T>(endpoint: string, userId: string): Promise<T> => {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "discord"
    }
  })
  if (!account?.access_token) {
    throw new Error("Failed to get a discord access token")
  }
  const resp = await fetch(`https://discord.com/api/${endpoint}`,{
    headers: {
      "Authorization": `Bearer ${account.access_token}`,
    }
  })
  if (!resp.ok) {
    console.error(resp.status, resp.statusText)
    throw Error(`Failed to fetch ${endpoint} from discord`)
  }
  return resp.json() as T;
}
