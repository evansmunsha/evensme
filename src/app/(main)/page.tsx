import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5 rounded-lg shadow-md ">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="for-you" className="text-[rgb(var(--primary))] hover:bg-[rgb(var(--muted))] rounded-lg transition-colors">For you</TabsTrigger>
            <TabsTrigger value="following" className="text-[rgb(var(--primary))] hover:bg-[rgb(var(--muted))] rounded-lg transition-colors">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
