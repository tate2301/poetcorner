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
  previousPost: Frontmatter | null;
  nextPost: Frontmatter | null;
}> => {
  const posts = (await readAllPosts()).reverse();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previousPost: null, nextPost: null };
  }

  let previousPost: Frontmatter | null = null;
  let nextPost: Frontmatter | null = null;

  if (index > 0) {
    previousPost = posts[index - 1];
  }

  if (index < posts.length - 1) {
    nextPost = posts[index + 1];
  }

  return { previousPost, nextPost };
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

async function MDXLayout(props: {
  children: ReactNode;
  params: { slug: string };
}) {
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

      <div className="flex justify-between text-[var(--gray-500)] w-full max-w-xl mx-auto flex-col text-center text-3xl my-16">
        <div className="flex justify-between mb-12">
          {siblings.previousPost ? (
            <Link href={`/posts/${siblings.previousPost.slug}`}>
              0{siblings.previousPost.index}.
            </Link>
          ) : (
            <div />
          )}
          {siblings.nextPost ? (
            <Link href={`/posts/${siblings.nextPost.slug}`}>
              0{siblings.nextPost.index}.
            </Link>
          ) : (
            <div />
          )}
        </div>
        <Link href={"/"} className={instrument_serif_italic.className}>
          Table of contents
        </Link>
      </div>
    </main>
  );
}

export default MDXLayout;
