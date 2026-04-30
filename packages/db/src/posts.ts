import type { Post } from "./data.js";
import { client } from "./client.js";
import type { Prisma } from "@prisma/client";

type PostRow = Post & {
  // Prisma's _count field for counting related records
  //return number of likes for each post
  _count: {
    Likes: number;
  };
};

const postQuery = {
  //also return the count of Likes for each post
  include: {
    _count: {
      select: {
        Likes: true,
      },
    },
  },
} as const; //make object read-only to ensure type safety

function mapPostRow(post: PostRow): Post {
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

async function findPosts(where?: Prisma.PostWhereInput): Promise<Post[]> {
  const dbPosts = (await client.db.post.findMany({
    ...postQuery,
    where: {
      active: true,
      ...where,
    },
  })) as PostRow[];

  return dbPosts.map(mapPostRow);
}

//async function -> promise that resolves to an array of Post objects
export async function getPostsForWeb(): Promise<Post[]> {
  return findPosts();
}

export async function getPostsForAdmin(): Promise<Post[]> {
  const dbPosts = (await client.db.post.findMany({
    ...postQuery,
  })) as PostRow[];

  return dbPosts.map(mapPostRow);
}

export async function setPostActiveById(id: number, active: boolean): Promise<Post | null> {
  const updatedPost = (await client.db.post.update({
    where: {
      id,
    },
    data: {
      active,
    },
    ...postQuery,
  })) as PostRow;

  return mapPostRow(updatedPost);
}

export async function getPostsBySearch(query: string): Promise<Post[]> {
  const q = query.trim();
  if (!q) {
    return findPosts();
  }

  //case-insensitive search for query in title, description, content, category, or tags
  return findPosts({
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { tags: { contains: q, mode: "insensitive" } },
    ],
  });
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return findPosts({
    category: {
      equals: categorySlug,
      mode: "insensitive", //no case-sensitive search
    },
  });
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const possibleTags: string[] = [];
  possibleTags.push(tagSlug);
  if (tagSlug.includes("-")) {
    possibleTags.push(tagSlug.replaceAll("-", " "));
  }

  return findPosts({
    //match any of the possible tags
    OR: possibleTags.map((tag) => ({
      tags: {
        contains: tag, //match tag as substring to allow multiple tags in a post
        mode: "insensitive", //no case-sensitive search for tags
      },
    })),
  });
}

export async function getPostsByHistory(year: number, month: number): Promise<Post[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  return findPosts({
    date: {
      gte: startDate, //greater than or equal to startDate
      lt: endDate, //less than endDate to include all posts in the specified month
    },
  });
}

export async function getPostForWebByUrlId(urlId: string): Promise<Post | null> {
  const post = (await client.db.post.findUnique({
    where: {
      urlId,
    },
    ...postQuery,
  })) as PostRow | null;

  if (!post) {
    return null;
  }

  return mapPostRow(post);
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

export async function getPostByUrlIdForAdmin(urlId: string): Promise<Post | null> {
  const post = (await client.db.post.findUnique({
    where: {
      urlId,
    },
    ...postQuery,
  })) as PostRow | null;

  if (!post) {
    return null;
  }

  return mapPostRow(post);
}

export async function createPost(data: {
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string;
}): Promise<Post> {
  //generate id by counting existing posts and adding 1
  const id = await client.db.post.count() + 1;
  const newPost = (await client.db.post.create({
    data: { ...data, id },
    ...postQuery,
  })) as PostRow;

  return mapPostRow(newPost);
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    content: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string;
  }
): Promise<Post | null> {
  const updatedPost = (await client.db.post.update({
    where: { id },
    data,
    ...postQuery,
  })) as PostRow | null;

  //if no post was found with the given id, return null
  if (!updatedPost) {
    return null;
  }

  return mapPostRow(updatedPost);
}