import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";
import React from "react";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  })

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
    description: `${user.displayName}'s profile on our platform.`,
    keywords: 'user profile, social media, follow',
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-3">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded bg-card p-2 shadow-sm">
          <h2 className="text-center text-lg font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

const UserProfile = React.memo(({ user, loggedInUserId }: UserProfileProps) => {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded bg-card p-2 shadow-sm">
      <div className="flex flex-col">

        <div className=" md:flex w-full">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={250}
            className="size-full max-h-32 max-w-32 rounded-full"
          />
          


          <div className="flex flex-wrap items-end justify-end gap-3 sm:flex-nowrap flex-1">
            <div className="w-full items-center space-y-3 flex-col flex">
              <div className=" float-end">
                <h1 className="text-xl text-red-500 font-bold">{user.displayName}</h1>
                <div className="text-muted-foreground">@{user.username}</div>
              </div>
              <div className="text-center float-end">Participant since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
              <div className=" float-end flex items-center gap-3">
                <span>
                  Posts:{" "}
                  <span className="font-semibold">
                    {formatNumber(user._count.posts)}
                  </span>
                </span>
                <FollowerCount userId={user.id} initialState={followerInfo} />
              </div>
            </div>
          </div>
        </div>


        <div className="flex items-end float-end my-1">

          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
          )}
        </div>
        <hr className="h-1 block bg-white m-0"/>
      </div>
      <div>

        {user.bio && (
          <>
            <Linkify>
              <div className="overflow-hidden whitespace-pre-line break-words text-white bg-red-500 p-1 rounded-sm">
                {user.bio}
              </div>
            </Linkify>
          </>
        )}
      </div>
    </div>
  );
});

UserProfile.displayName = "UserProfile"; // Set display name explicitly
