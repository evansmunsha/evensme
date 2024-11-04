import { type ClassValue, clsx } from "clsx";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
export function constructMetadata({
  
  title = 'evansbook a social business website and forum',
  description = 'evansbook is an open-source social business website and forum, where Participants could submit content such as links, text posts, images and videos, where others could follow a user they can like or dislike  a post or you can be chating with your friends. you can create an account now to start promoting your brand every day.',
  image = '/thumbnail.png',
  icons = '/thumbnail.png',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@evansensteen',
    },
    icons,
    metadataBase: new URL('https://evensme.vercel.app/'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}