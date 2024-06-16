import Footer from "@/components/Footer";
import { PostsList } from "@/components/PostsList";
import VerticalDivider from "@/components/VerticalDivider";
import { instrument_serif, instrument_serif_italic } from "@/lib/fonts";
import { readAllPosts } from "@/lib/post";
import Pen from "@/public/pen.png";
import Image from "next/image";

export default async function Home() {
  const posts = await readAllPosts();

  return (
    <main className="py-24 px-4 container mx-auto flex flex-col items-center">
      <Image src={Pen} alt="Pen" width={200} height={200} />
      <h1
        className={
          "max-w-sm text-center text-balance text-7xl text-[var(--gray-500)] mb-16 " +
          instrument_serif.className
        }
      >
        Penned{" "}
        <span className={instrument_serif_italic.className}>pieces about</span>{" "}
        everything
      </h1>
      <VerticalDivider height={96} />
      <div className="flex text-[24px] flex-col max-w-xl gap-6 my-16">
        <PostsList posts={posts} />
      </div>
      <VerticalDivider height={192} />
      <Footer />
    </main>
  );
}
