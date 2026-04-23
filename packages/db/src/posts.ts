import type { Post } from "./data.js";
import { client } from "./client.js";

type PostRow = Post & {
  // Prisma's _count field for counting related records
  //return number of likes for each post
  _count: {
    Likes: number;
  };
};

//async function -> promise that resolves to an array of Post objects
export async function getPostsForWeb(): Promise<Post[]> {
  const dbPosts = (await client.db.post.findMany({
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })) as PostRow[];

  return dbPosts.map((post) => ({
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.Likes,
    tags: post.tags,
    active: post.active,
  }));
}

export async function getPostForWebByUrlId(urlId: string): Promise<Post | null> {
  const post = (await client.db.post.findUnique({
    where: {
      urlId,
    },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  })) as PostRow | null;

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.Likes,
    tags: post.tags,
    active: post.active,
  };
}

export async function incrementPostViewsById(id: number): Promise<void> {
  await client.db.post.update({
    where: {
      id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}