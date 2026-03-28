// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[],) {
  
  const tagMap: Record<string, number> = {};

  posts
    .filter((p) => p.active)
    .forEach((post) => {
      const postTags = post.tags.split(",").map((t) => t.trim());
      postTags.forEach((tag) => {
        if (tag) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      });
    });

  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
