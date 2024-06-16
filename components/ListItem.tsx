import Link from "next/link";

export default function ListItem({
  title,
  index,
  href,
  publishDate,
}: {
  title: string;
  index: number;
  href: string;
  publishDate: string;
}) {
  return (
    <li>
      <Link href={`/posts/${href}`} className="flex">
        <p className="w-20">0{index}.</p>
        <p className="hover:text-[var(--gray-500)]">{title}</p>
      </Link>
    </li>
  );
}
