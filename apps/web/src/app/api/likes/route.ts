import { client } from "@repo/db/client";
import { NextResponse, type NextRequest } from "next/server";

function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }

  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(request: NextRequest) {
  let body: { postId?: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const postId = Number(body.postId);

  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  const userIP = getRequestIp(request);

  const postExists = await client.db.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!postExists) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const existingLike = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
  });

  if (existingLike) {
    await client.db.like.delete({
      where: {
        postId_userIP: {
          postId,
          userIP,
        },
      },
    });
  } else {
    await client.db.like.create({
      data: {
        postId,
        userIP,
      },
    });
  }

  const post = await client.db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    likes: post._count.Likes,
    liked: !existingLike,
  });
}