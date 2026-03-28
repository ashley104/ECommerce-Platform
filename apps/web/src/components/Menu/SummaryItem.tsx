import Link from "next/link";
import { cx } from "@repo/utils/classes";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    //use Link component to wrap the whole item for test
    <Link
      href={link}
      title={title}
      className={cx( //use cx to conditionally apply classes
        "flex items-center",
        {
          "bg-indigo-300 selected": isSelected,
          "bg-transparent": !isSelected,
        },
      )}
    >
      <button data-test-id="post-count" title={count.toString() || "0"} className="bg-transparent border border-gray-300 text-gray-300 rounded px-1.5 py-0.5 text-xs">
        {count}
      </button>
      <span className="pl-3 font-semibold hover:text-purple-500">{name}</span>
    </Link>
  );
}
