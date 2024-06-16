import VerticalDivider from "@/components/VerticalDivider";
import { instrument_serif_italic } from "@/lib/fonts";
import Link from "next/link";
import Fly from "@/public/fly.png";
import Image from "next/image";
import { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { readFile, access, readdir } from "fs/promises";
import { notFound } from "next/navigation";
import { Frontmatter, readAllPosts } from "@/lib/post";
import { Metadata } from "next";

const POSTS_FOLDER = path.join(process.cwd(), "posts");

async function readPostFile(slug: string) {
  const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`));

  try {
    await access(filePath);
  } catch (err) {
    return null;
  }

  const fileContent = await readFile(filePath, { encoding: "utf8" });
  return fileContent;
}

const getSiblings = async (
  slug: string
): Promise<{
  previousPosts: Frontmatter[];
  nextPosts: Frontmatter[];
}> => {
  const posts = (await readAllPosts()).reverse();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previousPosts: [], nextPosts: [] };
  }

  const previousPosts = posts.slice(0, index);
  const nextPosts = posts.slice(index + 1);

  return { previousPosts, nextPosts };
};

export const generateMetadata = async (props: {
  params: { slug: string };
}): Promise<Metadata> => {
  const markdown = await readPostFile(props.params.slug);

  if (!markdown) {
    notFound();
  }

  const { frontmatter } = await compileMDX<Frontmatter>({
    source: markdown,
    options: { parseFrontmatter: true },
  });

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    publisher: "@poetcorner",
    authors: { name: "T. D. Kamusoko" },
    keywords: ["poetry", "writing", "T. D. Kamusoko"],
  };
};

async function MDXLayout(props: { params: { slug: string } }) {
  const markdown = await readPostFile(props.params.slug);

  if (!markdown) {
    notFound();
  }

  const siblings = await getSiblings(props.params.slug);

  const { content, frontmatter } = await compileMDX<{
    title: string;
    index: number;
    image: string;
  }>({
    source: markdown,
    options: { parseFrontmatter: true },
  });

  return (
    <main className="py-24 px-4 container mx-auto flex flex-col items-center">
      <div className="mb-16 w-full max-w-xl mx-auto text-center text-xl">
        <Link href={"/"} className={instrument_serif_italic.className}>
          Table of contents
        </Link>
      </div>
      <div className="my-12 w-fit">
        <Image
          src={frontmatter.image}
          alt={frontmatter.title}
          width={200}
          height={200}
        />
      </div>
      <div className="max-w-xl mt-16 mb-16 w-full text-center">
        <div className="flex justify-between text-[var(--gray-500)]">
          <p className="text-3xl mb-8 mx-auto">0{frontmatter.index}.</p>
        </div>
        <h1
          className={
            "text-[var(--gray-500)] text-7xl " +
            instrument_serif_italic.className
          }
        >
          {frontmatter.title}
        </h1>
      </div>
      <VerticalDivider height={96} />

      <p className="max-w-xl w-full text-center text-balance text-[var(--gray-500)] text-2xl my-16">
        {content}
      </p>
      <VerticalDivider height={320} />

      <div className="flex justify-between text-[var(--gray-500)] w-full container mx-auto flex-col text-center text-3xl my-16">
        <div className="flex justify-between mb-12">
          <div className="flex flex-col space-y-4">
            {siblings.previousPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="flex gap-8"
              >
                <p>0{post.index}.</p>
                <p className={instrument_serif_italic.className}>
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-4">
            {siblings.nextPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="flex gap-8"
              >
                <p>0{post.index}.</p>
                <p className={instrument_serif_italic.className}>
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MDXLayout;
