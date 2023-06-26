import { TRPCError } from "@trpc/server"
import { prisma } from "../db"
import { redis } from "../redis"

const getAccessTokenForUser = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "discord"
    }
  })
  if (!account?.access_token) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: "Failed to get a discord access token",
    })
  }
  return account.access_token;
}

export const fetchFromDiscord = async <T>(endpoint: string, userId: string): Promise<T> => {
  const access_token = await getAccessTokenForUser(userId);
  const resp = await fetch(`https://discord.com/api/${endpoint}`,{
    headers: {
      "Authorization": `Bearer ${access_token}`,
    }
  })
  if (!resp.ok) {
    console.error(resp.status, resp.statusText)
    throw Error(`Failed to fetch ${endpoint} from discord`)
  }
  return resp.json() as T;
}

export const getUserGuilds = async (userId: string) => {
  const accessToken = await getAccessTokenForUser(userId);
  const guilds = await redis.exists(accessToken);
  if (!guilds) {
    const newGuilds = await fetchFromDiscord<Discord.Guild[]>("users/@me/guilds", userId);
    const strippedGuilds = newGuilds.reduce<Record<string, string>>((set, val) => {
      set[val.id] = val.name
      return set;
    }, {}) as unknown as Record<string, string>;

    await redis.hset(accessToken, strippedGuilds);
    // Discord access token expires after 7 days
    await redis.expire(accessToken, 60 * 60 * 24 * 7)

    return newGuilds;
  }
  const guildsSet = await redis.hgetall<Record<string, string>>(accessToken);
  if (!guildsSet) return [];
  return Object.keys(guildsSet).map(k => ({ id: k, name: guildsSet[k]! }));
}
