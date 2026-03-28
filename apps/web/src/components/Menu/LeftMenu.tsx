import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu({
  selectedCategory,
  selectedTag,
  selectedHistory
}: {
  selectedCategory?: string;
  selectedTag?: string;
  selectedHistory?: string;
}) {
  return (
    <div className="w-[275px] shrink-0 min-h-screen p-5 self-start sticky top-0 bottom-0 border-r border-gray-200">
      <div className="flex items-center mb-10">
        <img src="/wsulogo.png" alt="WSU Logo" width={35} height={15} />
        <h1 className="font-bold pl-2">Full Stack Blog</h1>
      </div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <HistoryList selectedYear={selectedHistory?.split('/')[0]} selectedMonth={selectedHistory?.split('/')[1]} posts={posts} />
          </li>
          <li>
            <TagList selectedTag={selectedTag} posts={posts} />
          </li>
          {/* <li>Admin</li> */}
        </ul>
      </nav>
    </div>
  );
}
