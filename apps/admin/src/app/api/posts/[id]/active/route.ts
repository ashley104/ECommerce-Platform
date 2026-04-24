import { setPostActiveById } from "@repo/db/posts";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  let body: { active?: boolean };

  try {
    body = (await request.json()) as { active?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active is required" }, { status: 400 });
  }

  try {
    const updatedPost = await setPostActiveById(postId, body.active);

    return NextResponse.json({
      id: updatedPost?.id,
      active: updatedPost?.active,
    });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}