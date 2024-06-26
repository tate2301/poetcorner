import { Frontmatter, type Post } from "@/lib/post";
import Link from "next/link";
import ListItem from "./ListItem";

export function PostsList({ posts }: { posts: Frontmatter[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {posts.map(({ slug, title, publishDate, index }) => (
        <ListItem
          key={slug}
          title={title}
          publishDate={publishDate}
          href={slug}
          index={index}
        />
      ))}
    </ol>
  );
}
