import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      <div className="flex flex-col gap-5">
        {historyItems.map((item) => (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            count={item.count || 0}
            name={`${months[item.month ?? 0]}, ${item.year ?? ""}`}
            isSelected={
              item.year?.toString() === selectedYear && 
              item.month?.toString() === selectedMonth
            }
            link={`/history/${item.year ?? ""}/${item.month ?? ""}`}
            title={`History / ${months[item.month ?? 0]}, ${item.year ?? ""}`}
          />
        ))}
      </div>
    </LinkList>
  );
}
