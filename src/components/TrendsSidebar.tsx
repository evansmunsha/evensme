import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import Loading from "@/app/(main)/loading";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-full max-w-xs flex-none space-y-2 md:block lg:max-w-sm">
      <Suspense fallback={<LoadingIndicator />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

// Loading Indicator Component
function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center mx-auto h-[80vh]">
      <Loading />
    </div>
  );
}

export async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-3 rounded bg-card p-2 shadow-sm">
      <div className="text-sm text-red-600 font-bold">People you may know</div>
      {usersToFollow.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        usersToFollow.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-3">
            <UserTooltip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
                aria-label={`View profile of ${user.displayName}`}
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
              aria-label={`Follow ${user.displayName}`}
            />
          </div>
        ))
      )}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

export async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-2 rounded bg-card p-2 shadow-sm">
      <div className="text-lg font-bold">Trending topics</div>
      {trendingTopics.length === 0 ? (
        <p className="text-gray-500">No trending topics available.</p>
      ) : (
        trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];

          return (
            <Link key={title} href={`/hashtag/${title}`} className="block" aria-label={`View posts for ${hashtag}`}>
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })
      )}
    </div>
  );
}
