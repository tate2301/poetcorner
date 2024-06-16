import { instrument_serif_italic } from "@/lib/fonts";
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
      <Link href={`/posts/${href}`} className="flex text-3xl">
        <p className="w-20">0{index}.</p>
        <p
          className={`hover:text-[var(--gray-500)] ${instrument_serif_italic.className}`}
        >
          {title}
        </p>
      </Link>
    </li>
  );
}
