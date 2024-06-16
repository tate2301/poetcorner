import { access, readFile, readdir } from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";

export interface Post {
  slug: string;
  title: string;
  publishDate: string;
}

export interface Frontmatter {
  title: string;
  publishDate: string;
  index: number;
  image: string;
  slug: string;
  description: string;
}

export const POSTS_FOLDER = path.join(process.cwd(), "posts");

export async function getPosts(): Promise<Post[]> {
  // Retrieve slugs from post routes
  const slugs = (await readdir("./posts", { withFileTypes: true })).filter(
    (dirent) => dirent.isFile()
  );

  // Retrieve metadata from MDX files
  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(`../posts/${name}`);
      return { slug: name, ...metadata };
    })
  );

  // Sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return posts;
}

export const readAllPosts = async () => {
  const slugs = (await readdir(POSTS_FOLDER, { withFileTypes: true })).filter(
    (dirent) => dirent.isFile()
  );

  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      // read file from posts folder
      const filePath = path.resolve(path.join(POSTS_FOLDER, `${name}`));

      try {
        await access(filePath);
      } catch (err) {
        return null;
      }

      const fileContent = await readFile(filePath, { encoding: "utf8" });
      const { frontmatter } = await compileMDX<Frontmatter>({
        source: fileContent,
        options: { parseFrontmatter: true },
      });

      return { ...frontmatter, slug: name.split(".")[0] };
    })
  );

  posts.sort((a, b) => +b!.index - +a!.index).filter(Boolean);

  return posts as Frontmatter[];
};
