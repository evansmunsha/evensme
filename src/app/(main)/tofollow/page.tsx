import { validateRequest } from '@/auth'
import FollowButton from '@/components/FollowButton'
import UserAvatar from '@/components/UserAvatar'
import UserTooltip from '@/components/UserTooltip'
import prisma from '@/lib/prisma'
import { getUserDataSelect } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex  justify-center items-center bg-slate-500 h-fit'>
      <WhoToFollow/>
    </div>
  )
}

export default page

async function WhoToFollow() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card rounded shadow-sm w-full">
      <div className="col-span-full text-sm text-red-600 font-bold mb-2">
      People you may know
      </div>
      {usersToFollow.length === 0 ? (
        <p className="text-gray-500 w-full">No suggestions available.</p>
      ) : (
        usersToFollow.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-2 p-2 border rounded bg-white shadow-sm">
            <UserTooltip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-2"
                aria-label={`View profile of ${user.displayName}`}
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none rounded-none" />
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

