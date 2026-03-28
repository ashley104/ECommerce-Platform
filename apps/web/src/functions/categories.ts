// import { posts, type Post } from "../components/data";

export function categories<T>(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts.filter((post) => post.active)
    .reduce((acc, post) => { // Loop through active posts
      const existing = acc.find((item) => item.name === post.category);
      // If category already exists, increment count
      if (existing) {
        existing.count += 1; 
      }
      // If category does not exist, add it to the accumulator with count 1
      else {
        acc.push({ name: post.category, count: 1 });
      }
      return acc;
      //initialise accumulator as an array of objects with name and count
    }, [] as { name: string; count: number }[])
    .sort((a, b) => a.name.localeCompare(b.name)); //sort A-Z
}
