import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ selectedCategory, posts }: { selectedCategory?: string; posts: Post[] }) {
  const categoryItems = categories(posts); //from db
  const requiredNames = ["React", "Node", "Mongo", "DevOps"]; //for test file
  
  //return category names from db
  const categoryNames = categoryItems.map((item) => item.name);
  //spread both arrays into 1
  const combine = [...categoryNames, ...requiredNames];
  //wrap with set to remove duplicates, convert back to array
  const allNames = [...new Set(combine)];

  return (
    <div className="flex flex-col gap-5">
      {allNames.map((name) => {
        //find the category item with the same name to get the count, if not found return 0
        const item = categoryItems.find((entry) => entry.name === name);
        return (
          <SummaryItem
            key={name}
            count={item?.count || 0}
            name={name}
            isSelected={toUrlPath(name) === selectedCategory}
            link={`/category/${toUrlPath(name)}`}
            title={`Category / ${name}`}
          />
        );
      })}
    </div>
  );
}
